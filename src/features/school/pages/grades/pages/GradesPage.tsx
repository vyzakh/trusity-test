import { useMutation, useQuery } from "@apollo/client";
import { Spinner } from "@heroui/spinner";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { addToast } from "@heroui/toast";
import React from "react";
import { Link, useParams } from "react-router";
import { twMerge } from "tailwind-merge";

import { GRADES_BY_SCHOOL_QUERY } from "../../../services/queries";
import { DELETE_GRADE_MUTATION } from "../services/gradeMutations";

import { title } from "@/components/primitives";
import { Button, ConfirmModal } from "@/components/ui";
import { DEFAULT_ROW_STYLES, Table } from "@/components/ui/table";
import { handleApolloError } from "@/core/errors";
import type { GradesBySchoolQueryResponse } from "@/features/school/services/types";
import type { DeleteSchoolGradeResponse } from "../services/types";

const columns = [
  { name: "Sl.No", uid: "slno" },
  { name: "Grade/Year", uid: "grade" },
  { name: "Sections", uid: "section" },
  { name: "Action", uid: "action" },
];

export default function GradesPage() {
  const { schoolId } = useParams();

  //DELETE CONFIRM MODAL STATE
  const [openConfirm, setOpenConfirm] = React.useState<{
    isOpen: boolean;
    schoolGradeId: string | null;
  }>({
    schoolGradeId: null,
    isOpen: false,
  });

  //LIST ALL GRADES BY SCHOOL QUERY
  const { data: schoolData, loading } = useQuery<
    GradesBySchoolQueryResponse,
    { schoolId: string }
  >(GRADES_BY_SCHOOL_QUERY, {
    variables: { schoolId: schoolId! },
    skip: !schoolId,
  });

  //DELETE GRADE MUTATION
  const [deleteGrade, { loading: isDeleting }] = useMutation<
    DeleteSchoolGradeResponse,
    { schoolGradeId: string }
  >(DELETE_GRADE_MUTATION, { refetchQueries: [GRADES_BY_SCHOOL_QUERY] });

  //DESTRUCTURING GRADES
  const grades = schoolData?.school?.grades ?? [];

  //GRADES LOADING STATE
  const loadingState = loading ? "loading" : "idle";

  //DELETE CONFIRM MODAL CHANGE HANDLER
  const handleOpenChange = (
    isOpen: boolean,
    schoolGradeId: string | null = null,
  ) => {
    setOpenConfirm({
      isOpen: isOpen,
      schoolGradeId,
    });
  };

  //DELETE GRADE HANDLER
  const handleDeleteGrade = async () => {
    try {
      const response = await deleteGrade({
        variables: {
          schoolGradeId: openConfirm.schoolGradeId!,
        },
      });

      addToast({
        title: response?.data?.deleteSchoolGrade?.message,
        color: "success",
      });
      setOpenConfirm({ schoolGradeId: null, isOpen: false });
    } catch (error) {
      const errMessage = handleApolloError(error);

      addToast({ title: errMessage, color: "danger" });
    }
  };

  return (
    <React.Fragment>
      <Table
        aria-label="Grade/Year Section table"
        bottomContentPlacement="outside"
        topContent={
          <h1 className={title({ size: "sm", className: "font-bold" })}>
            Grade/Year & Sections
          </h1>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={
                ["action", "grade"].includes(column.uid) ? "center" : "start"
              }
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No grades found"
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {grades?.map((grade, i) => {
            return (
              <TableRow key={grade?.id} className={twMerge(DEFAULT_ROW_STYLES)}>
                <TableCell className="w-36">{i + 1}</TableCell>
                <TableCell>{grade?.grade?.grade}</TableCell>
                <TableCell>
                  {grade?.sections
                    ?.map((section) => section.section?.section)
                    ?.join(", ")}
                </TableCell>
                <TableCell className="w-32 text-center">
                  <div className="flex items-center justify-center">
                    <Button
                      isIconOnly
                      as={Link}
                      className="data-[hover=true]:bg-default/20"
                      radius="full"
                      size="sm"
                      to={`${grade?.id}/update`}
                      variant="light"
                    >
                      <svg
                        fill="none"
                        height="16"
                        viewBox="0 0 17 16"
                        width="17"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="group-hover:fill-white"
                          d="M14.7069 4.58561L11.9144 1.79249C11.8215 1.6996 11.7113 1.62592 11.5899 1.57565C11.4686 1.52539 11.3385 1.49951 11.2072 1.49951C11.0759 1.49951 10.9458 1.52539 10.8245 1.57565C10.7031 1.62592 10.5929 1.6996 10.5 1.79249L2.79313 9.49999C2.69987 9.59251 2.62593 9.70265 2.5756 9.824C2.52528 9.94535 2.49959 10.0755 2.50001 10.2069V13C2.50001 13.2652 2.60536 13.5196 2.7929 13.7071C2.98043 13.8946 3.23479 14 3.50001 14H6.29313C6.4245 14.0004 6.55464 13.9747 6.67599 13.9244C6.79735 13.8741 6.90748 13.8001 7.00001 13.7069L14.7069 5.99999C14.7998 5.90712 14.8734 5.79687 14.9237 5.67553C14.974 5.55419 14.9999 5.42414 14.9999 5.2928C14.9999 5.16146 14.974 5.0314 14.9237 4.91006C14.8734 4.78872 14.7998 4.67847 14.7069 4.58561ZM6.29313 13H3.50001V10.2069L9.00001 4.70686L11.7931 7.49999L6.29313 13ZM12.5 6.79249L9.70688 3.99999L11.2069 2.49999L14 5.29249L12.5 6.79249Z"
                          fill="#595959"
                        />
                      </svg>
                    </Button>
                    <Button
                      isIconOnly
                      className="group-hover:text-danger data-[hover=true]:bg-default/20"
                      radius="full"
                      size="sm"
                      variant="light"
                      onPress={() => handleOpenChange(true, grade?.id)}
                    >
                      <svg
                        height={16}
                        viewBox="0 0 24 24"
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m18 9l-.84 8.398c-.127 1.273-.19 1.909-.48 2.39a2.5 2.5 0 0 1-1.075.973C15.098 21 14.46 21 13.18 21h-2.36c-1.279 0-1.918 0-2.425-.24a2.5 2.5 0 0 1-1.076-.973c-.288-.48-.352-1.116-.48-2.389L6 9m7.5 6.5v-5m-3 5v-5m-6-4h4.615m0 0l.386-2.672c.112-.486.516-.828.98-.828h3.038c.464 0 .867.342.98.828l.386 2.672m-5.77 0h5.77m0 0H19.5"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                        />
                      </svg>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmModal
        description=" This action is permanent and cannot be undone."
        isLoading={isDeleting}
        isOpen={openConfirm?.isOpen}
        message="Are you sure you want to delete this grade?"
        title="Delete Grade"
        onCancel={() => handleOpenChange(false)}
        onConfirm={handleDeleteGrade}
      />
    </React.Fragment>
  );
}
