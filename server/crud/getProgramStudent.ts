import { getAnonymousId } from "@ServerUtils";
import { Curriculum, Program, StudentCurriculum } from "@Models/api";
import _ from "lodash";

const getProgramStudent = async (student_id: string) => {
  if (student_id) {
    const anonimizado = await getAnonymousId(student_id);
    if (anonimizado) {
      student_id = anonimizado;
    }

    const student_curriculum = await StudentCurriculum.findOne({
      where: {
        student_id,
      },
      order: [["year", "DESC"]],
    });

    if (student_curriculum) {
      const curriculum_id = student_curriculum.curriculum_id;
      const curriculum = await Curriculum.findByPk(curriculum_id);
      if (curriculum) {
        const program_id = curriculum.program_id;
        const program = await Program.findByPk(program_id);
        if (program) {
          return {
            student_id,
            program_id,
            name: program.name,
            year: curriculum.year,
          };
        }
      }
    }
  }

  return null;
};

export default getProgramStudent;
