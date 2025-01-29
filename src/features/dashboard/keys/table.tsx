import { Alert, AlertDescription, AlertTitle } from "@/ui/primitives/alert";
import { Loader } from "@/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/primitives/table";
import { FC } from "react";
import TableBodyContent from "./table-body";
import { Suspense } from "react";

interface ApiKeysTableProps {
  teamId: string;
}

const ApiKeysTable: FC<ApiKeysTableProps> = ({ teamId }) => {
  return (
    <>
      <Table className="w-full animate-in fade-in">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Key</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="text-right">Created At</TableHead>
            <th></th>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense
            fallback={
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-left">
                  <Alert className="w-full text-left" variant="contrast2">
                    <AlertTitle className="flex items-center gap-2">
                      <Loader variant="compute" />
                      Loading keys...
                    </AlertTitle>
                    <AlertDescription>This may take a moment.</AlertDescription>
                  </Alert>
                </TableCell>
              </TableRow>
            }
          >
            <TableBodyContent teamId={teamId} />
          </Suspense>
        </TableBody>
      </Table>
    </>
  );
};

export default ApiKeysTable;
