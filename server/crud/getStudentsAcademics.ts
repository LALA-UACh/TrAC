import {
    Curriculum, CurriculumModel, Program, ProgramModel, Student, StudentCurriculum,
    StudentCurriculumModel, StudentDropout, StudentDropoutModel, StudentModel
} from "@Models/api";

export type StudentMixin = StudentModel & {
  student_curriculums: (StudentCurriculumModel & {
    curriculum: CurriculumModel & {
      program: ProgramModel;
    };
  })[];
  student_dropout: StudentDropoutModel;
};

export default async (studentId: string, programId: number) => {
  const student: StudentMixin | null = await Student.findOne<any>({
    order: [[StudentCurriculum, Curriculum, "year", "DESC"]],
    where: {
      id: studentId,
      state: "active",
    },
    include: [
      {
        model: StudentCurriculum,
        include: [
          {
            model: Curriculum,
            where: {
              state: "active",
            },
            include: [
              {
                model: Program,
                where: {
                  id: programId,
                  state: "active",
                },
              },
            ],
          },
        ],
      },
      {
        model: StudentDropout,
      },
    ],
  });
  return student;
};
