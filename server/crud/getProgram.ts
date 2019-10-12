import {
  Curriculum,
  Program,
  CurriculumModel,
  ProgramModel,
} from "@Models/api";

export type ProgramsMixin = CurriculumModel & {
  program: ProgramModel;
};

export default async (id: number, year: number) => {
  const data: ProgramsMixin = await Curriculum.findOne<any>({
    where: {
      "$program.id$": id,
      "$program.state$": "active",
      year: year,
      state: "active",
    },
    include: [{ model: Program }],
  });
  return data;
};
