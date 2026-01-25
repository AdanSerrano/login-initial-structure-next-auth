"use client";

import { memo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MoreHorizontal,
  Trash2,
  Eye,
  Power,
  PowerOff,
  Archive,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { CustomColumnDef } from "@/components/custom-datatable";
import type { DemoProduct, ProductStatus, ProductCategory } from "../../types/demo-table.types";

interface ColumnActions {
  onView: (product: DemoProduct) => void;
  onDelete: (product: DemoProduct) => void;
  onChangeStatus: (product: DemoProduct, status: ProductStatus) => void;
}

// ============================================
// CONSTANTS
// ============================================

const statusConfig: Record<
  ProductStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
> = {
  active: { label: "Activo", variant: "default", icon: Power },
  inactive: { label: "Inactivo", variant: "secondary", icon: PowerOff },
  discontinued: { label: "Descontinuado", variant: "destructive", icon: Archive },
};

const categoryLabels: Record<ProductCategory, string> = {
  electronics: "Electrónica",
  clothing: "Ropa",
  food: "Alimentos",
  books: "Libros",
  other: "Otros",
};

const categoryColors: Record<ProductCategory, string> = {
  electronics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  clothing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  food: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  books: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

// ============================================
// MEMOIZED CELL COMPONENTS
// ============================================

// Product Name Cell with image
const ProductCell = memo(function ProductCell({
  name,
  sku,
  imageUrl,
}: {
  name: string;
  sku: string;
  imageUrl: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <p className="font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{sku}</p>
      </div>
    </div>
  );
});

// Category Badge Cell
const CategoryCell = memo(function CategoryCell({
  category,
}: {
  category: ProductCategory;
}) {
  return (
    <Badge variant="outline" className={cn("font-normal", categoryColors[category])}>
      {categoryLabels[category]}
    </Badge>
  );
});

// Price Cell
const PriceCell = memo(function PriceCell({ price }: { price: number }) {
  return (
    <span className="font-mono font-medium">
      ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
    </span>
  );
});

// Stock Cell with low stock warning
const StockCell = memo(function StockCell({ stock }: { stock: number }) {
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock === 0;

  return (
    <div className="flex items-center justify-center gap-1">
      {isLowStock && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>Stock bajo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <span
        className={cn(
          "font-mono",
          isOutOfStock && "text-destructive",
          isLowStock && "text-amber-600 font-medium"
        )}
      >
        {stock}
      </span>
    </div>
  );
});

// Status Badge Cell
const StatusCell = memo(function StatusCell({ status }: { status: ProductStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
});

// Updated At Cell with tooltip
const UpdatedAtCell = memo(function UpdatedAtCell({
  updatedAt,
}: {
  updatedAt: Date;
}) {
  const date = new Date(updatedAt);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm text-muted-foreground">
            {format(date, "dd MMM yyyy", { locale: es })}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {format(date, "dd/MM/yyyy HH:mm", { locale: es })}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Actions Dropdown Cell
interface ActionsCellProps {
  product: DemoProduct;
  onView: (product: DemoProduct) => void;
  onDelete: (product: DemoProduct) => void;
  onChangeStatus: (product: DemoProduct, status: ProductStatus) => void;
}

const ActionsCell = memo(function ActionsCell({
  product,
  onView,
  onDelete,
  onChangeStatus,
}: ActionsCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onView(product)} className="gap-2">
          <Eye className="h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {product.status !== "active" && (
          <DropdownMenuItem
            onClick={() => onChangeStatus(product, "active")}
            className="gap-2 text-green-600"
          >
            <Power className="h-4 w-4" />
            Activar
          </DropdownMenuItem>
        )}

        {product.status !== "inactive" && (
          <DropdownMenuItem
            onClick={() => onChangeStatus(product, "inactive")}
            className="gap-2 text-amber-600"
          >
            <PowerOff className="h-4 w-4" />
            Desactivar
          </DropdownMenuItem>
        )}

        {product.status !== "discontinued" && (
          <DropdownMenuItem
            onClick={() => onChangeStatus(product, "discontinued")}
            className="gap-2 text-gray-600"
          >
            <Archive className="h-4 w-4" />
            Descontinuar
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(product)}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// ============================================
// COLUMNS FACTORY
// ============================================

export function createDemoTableColumns(actions: ColumnActions): CustomColumnDef<DemoProduct>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "Producto",
      enableSorting: true,
      enableHiding: false,
      minWidth: 250,
      cell: ({ row }) => (
        <ProductCell name={row.name} sku={row.sku} imageUrl={row.imageUrl} />
      ),
    },
    {
      id: "category",
      accessorKey: "category",
      header: "Categoría",
      enableSorting: true,
      minWidth: 120,
      cell: ({ row }) => <CategoryCell category={row.category} />,
    },
    {
      id: "price",
      accessorKey: "price",
      header: "Precio",
      align: "right",
      enableSorting: true,
      minWidth: 100,
      cell: ({ row }) => <PriceCell price={row.price} />,
    },
    {
      id: "stock",
      accessorKey: "stock",
      header: "Stock",
      align: "center",
      enableSorting: true,
      minWidth: 100,
      cell: ({ row }) => <StockCell stock={row.stock} />,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Estado",
      align: "center",
      enableSorting: true,
      minWidth: 130,
      cell: ({ row }) => <StatusCell status={row.status} />,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Actualizado",
      enableSorting: true,
      minWidth: 140,
      cell: ({ row }) => <UpdatedAtCell updatedAt={row.updatedAt} />,
    },
    {
      id: "actions",
      header: "Acciones",
      align: "center",
      enableSorting: false,
      enableHiding: false,
      minWidth: 80,
      cell: ({ row }) => (
        <ActionsCell
          product={row}
          onView={actions.onView}
          onDelete={actions.onDelete}
          onChangeStatus={actions.onChangeStatus}
        />
      ),
    },
  ];
}
