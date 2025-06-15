import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Inbox } from "lucide-react"
import type React from "react"

export type ColumnDef<T> = {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  className?: string
}

export type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean
  loadingRows?: number
  emptyState?: {
    icon?: React.ReactNode
    title: string
    description: string
  }
  pagination?: {
    currentPage: number
    hasMore: boolean
    onPageChange: (page: number) => void
  }
  rowClassName?: (item: T, index: number) => string
  keyField: keyof T
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  loadingRows = 5,
  emptyState = {
    title: "No data found",
    description: "There are no items to display at the moment.",
  },
  pagination,
  rowClassName,
  keyField,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: loadingRows }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={`loading-cell-${cellIndex}`}>
                      <div className="h-5 bg-muted/50 rounded animate-pulse w-full max-w-[200px]"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={String(item[keyField])} className={rowClassName ? rowClassName(item, index) : undefined}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={`${String(item[keyField])}-${cellIndex}`} className={column.className}>
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                          ? String(item[column.accessorKey] || "")
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    {emptyState.icon || <Inbox className="h-8 w-8 mb-2" />}
                    <p>{emptyState.title}</p>
                    <p className="text-sm">{emptyState.description}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && !isLoading && data.length > 0 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink isActive={pagination.currentPage === 1} onClick={() => pagination.onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>

            {pagination.currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pagination.currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => pagination.onPageChange(pagination.currentPage - 1)}>
                  {pagination.currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {pagination.currentPage > 1 && pagination.currentPage < 10 && (
              <PaginationItem>
                <PaginationLink isActive>{pagination.currentPage}</PaginationLink>
              </PaginationItem>
            )}

            {pagination.hasMore && (
              <PaginationItem>
                <PaginationLink onClick={() => pagination.onPageChange(pagination.currentPage + 1)}>
                  {pagination.currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {pagination.hasMore && pagination.currentPage < 9 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.hasMore && pagination.onPageChange(pagination.currentPage + 1)}
                className={!pagination.hasMore ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

