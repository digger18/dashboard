"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import { DebouncedInput } from "@/components/ui/input";
import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Sandbox } from "@/types/api";
import { QUERY_KEYS } from "@/configs/query-keys";
import { getTeamSandboxesAction } from "@/actions/sandboxes-actions";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  DataTableHead,
  DataTableCell,
  DataTableRow,
} from "@/components/ui/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TableFilterSection from "@/components/globals/table-filter-section";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "@/components/ui/loader";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export default function SandboxesTable() {
  "use no memo";

  const { teamId } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const { data: sandboxesData, isLoading: sandboxesLoading } = useQuery({
    queryKey: QUERY_KEYS.TEAM_SANDBOXES(teamId as string),
    queryFn: () =>
      getTeamSandboxesAction({
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        teamId: teamId as string,
      }),
  });

  const table = useReactTable({
    data: sandboxesData?.type === "success" ? sandboxesData.data : [],
    columns: COLUMNS,
    state: {
      globalFilter,
      sorting,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  return (
    <>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="space-y-2">
            <CardTitle>Active Sandboxes</CardTitle>
            <CardDescription>
              View and manage your active sandbox environments.
            </CardDescription>
          </div>
          <DebouncedInput
            value={globalFilter}
            onChange={(v) => setGlobalFilter(v as string)}
            placeholder="Fuzzy search..."
            className="w-[320px]"
          />
        </CardHeader>
        <CardContent>
          <TableFilterSection
            globalFilter={globalFilter}
            sorting={sorting}
            table={table}
          />
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <DataTableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DataTableHead
                      key={header.id}
                      column={header.column}
                      sorting={sorting.find((s) => s.id === header.id)?.desc}
                    >
                      {header.isPlaceholder
                        ? ""
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </DataTableHead>
                  ))}
                </DataTableRow>
              ))}
            </TableHeader>
            <TableBody>
              {sandboxesLoading ? (
                <DataTableRow>
                  <TableCell colSpan={COLUMNS.length} className="h-24">
                    <Alert className="w-full">
                      <AlertDescription className="flex items-center gap-2">
                        <Loader variant="compute" />
                        Loading sandboxes...
                      </AlertDescription>
                    </Alert>
                  </TableCell>
                </DataTableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <DataTableRow key={row.id} isSelected={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell) => (
                      <DataTableCell
                        key={cell.id}
                        cell={flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      />
                    ))}
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center"
                  >
                    No sandboxes found.
                  </TableCell>
                </DataTableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

const COLUMNS: ColumnDef<Sandbox>[] = [
  {
    accessorKey: "alias",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-mono font-medium">{row.getValue("alias")}</div>
    ),
  },
  {
    accessorKey: "sandboxID",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-fg-500">
        {row.getValue("sandboxID")}
      </div>
    ),
  },
  {
    accessorKey: "cpuCount",
    header: "CPU",
    cell: ({ row }) => (
      <div className="font-mono">{row.getValue("cpuCount")}x vCPU</div>
    ),
  },
  {
    accessorKey: "memoryMB",
    header: "Memory",
    cell: ({ row }) => (
      <div className="font-mono">
        {(row.getValue("memoryMB") as number) / 1024}GB RAM
      </div>
    ),
  },
  {
    accessorKey: "startedAt",
    header: "Started",
    cell: ({ row }) => (
      <div className="font-mono text-xs">
        {formatDistanceToNow(new Date(row.getValue("startedAt")), {
          addSuffix: true,
        })}
      </div>
    ),
  },
  {
    accessorKey: "endAt",
    header: "Duration",
    cell: ({ row }) => {
      const start = new Date(row.getValue("startedAt"));
      const end = new Date(row.getValue("endAt"));
      const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return (
        <div className="font-mono text-xs">{duration.toFixed(1)} hours</div>
      );
    },
  },
];
