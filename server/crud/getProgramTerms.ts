import { Op } from "sequelize";
import {
  GroupCourseAcademic,
  ProgramCourse,
  Course,
  ProgramTerm,
  GroupCourseAcademicModel,
  ProgramCourseModel,
  CourseModel,
  ProgramTermModel,
} from "@Models/api";

export type ProgramTermsMixin = ProgramTermModel & {
  program_courses: (ProgramCourseModel & {
    course: CourseModel & {
      statistic: GroupCourseAcademicModel;
    };
  })[];
};

export default async (curriculum_id: number) => {
  const terms: ProgramTermsMixin[] = await ProgramTerm.findAll<any>({
    order: [["position", "ASC"]],
    where: {
      curriculum_id: curriculum_id,
      [Op.or]: [
        { "$program_courses.state$": "active" },
        { "$program_courses.state$": null },
      ],
      position: {
        [Op.ne]: 0,
      },
    },
    include: [
      {
        model: ProgramCourse,
        include: [
          {
            model: Course,
            where: {
              state: "active",
            },
            include: [
              {
                model: GroupCourseAcademic,
              },
            ],
          },
        ],
      },
    ],
  });
  return terms;
};
