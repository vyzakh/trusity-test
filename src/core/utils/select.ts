type GradeOption = { id: string; name: string };
type GradeText = { text: string };
type Grade = GradeOption | GradeText | null | undefined;

export function extractGradeValues(grade?: Grade) {
  if (!grade) {
    return {
      gradeId: "",
      grade: "",
    };
  }

  if ("text" in grade) {
    return {
      gradeId: "",
      grade: grade.text,
    };
  }

  return {
    gradeId: grade.id,
    grade: grade.name,
  };
}
