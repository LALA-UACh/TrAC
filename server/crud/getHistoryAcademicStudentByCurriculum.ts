import { Sequelize } from "sequelize";
import {
  GroupCourseAcademic,
  GroupCourseByTerm,
  Course,
  StudentStatisticByTerm,
  History,
  // GroupCourseAcademicModel,
  GroupCourseByTermModel,
  CourseModel,
  StudentStatisticByTermModel,
  HistoryModel,
} from "@Models/api";

export type HistoryAcademicMixin = HistoryModel &
  ({
    statistic_student_term: StudentStatisticByTermModel;
    course: CourseModel &
      ({
        statisticTerms: GroupCourseByTermModel[];
      });
  });

export default async (
  curriculumId: number,
  studentId: number,
  _cohortYear: number
) => {
  //Cohort year for the statistics cohort
  const historyAcademics: HistoryAcademicMixin[] = await History.findAll<any>({
    order: [["year", "ASC"], ["semester", "ASC"]],
    where: {
      student_id: studentId,
    },
    include: [
      {
        model: StudentStatisticByTerm,
        /*on:{
                  col1: Sequelize.where(Sequelize.col("history_academic_course.year"), "=", Sequelize.col("statistic_student_term.year")),
                  col2: Sequelize.where(Sequelize.col("history_academic_course.semester"), "=", Sequelize.col("statistic_student_term.semester")),
                  col3: Sequelize.where(Sequelize.col("statistic_student_term.student_id"), "=", studentId)
                }*/
      },
      {
        model: Course,
        where: {
          curriculum_id: curriculumId,
          state: "active",
        },
        include: [
          {
            model: GroupCourseByTerm,
            on: {
              col1: Sequelize.where(
                Sequelize.col("course.code"),
                "=",
                Sequelize.col("course->statisticTerms.course_code")
              ),
              col2: Sequelize.where(
                Sequelize.col("history_academic_course.year"),
                "=",
                Sequelize.col("course->statisticTerms.year")
              ),
              col3: Sequelize.where(
                Sequelize.col("history_academic_course.semester"),
                "=",
                Sequelize.col("course->statisticTerms.semester")
              ),
            },
          },
          {
            model: GroupCourseAcademic,
          },
        ],
      },
    ],
  });
  return historyAcademics;
};
