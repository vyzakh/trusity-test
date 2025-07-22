import { z } from "zod";

export const AssignmentsSchema = z.object({
  assignments: z
    .array(
      z
        .object({
          schoolId: z.string().min(1, "School ID is required"),
          isEntire: z.boolean(),
          grades: z.array(
            z
              .object({
                isEntire: z.boolean(),
                gradeId: z.string().min(1, "Grade ID is required"),
                sections: z.array(
                  z
                    .object({
                      isEntire: z.boolean(),
                      sectionId: z.string().min(1, "Section ID is required"),
                      studentIds: z.array(
                        z.string().min(1, "Student ID cannot be empty"),
                      ),
                    })
                    .refine(
                      (section) => {
                        // If section is not entire, studentIds array should not be empty
                        if (!section.isEntire) {
                          return section.studentIds.length > 0;
                        }
                        return true;
                      },
                      {
                        message:
                          "Student IDs are required when section is not entire",
                        path: ["studentIds"],
                      },
                    ),
                ),
              })
              .refine(
                (grade) => {
                  if (!grade.isEntire) {
                    return grade.sections.length > 0;
                  }
                  return true;
                },
                {
                  message: "Sections are required when grade is not entire",
                  path: ["sections"],
                },
              ),
          ),
        })
        .refine(
          (assignment) => {
            if (!assignment.isEntire) {
              return assignment.grades.length > 0;
            }
            return true;
          },
          {
            message: "Grades are required when assignment is not entire",
            path: ["grades"],
          },
        ),
    )
    .min(1, "At least one assignment is required"),
});

export type AssignmentsSchemaType = z.infer<typeof AssignmentsSchema>;
