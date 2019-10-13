import { BuildOptions, col, DataTypes, Model, where } from "sequelize";

import { sequelizeLalauach as sequelize } from "@Models";

export class CourseModel extends Model {
  code: string;
  name: string;
  description: string;
  credits: number;
  tags: string;
  state: string;
  curriculum_id: string;
  id: number;
  area: string;
}

export type CourseStatic = typeof CourseModel & {
  new (values?: object, options?: BuildOptions): CourseModel;
};

export const Course = <CourseStatic>sequelize.define(
  "course",
  {
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    credits: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "state",
    },
    curriculum_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "curriculum",
        key: "id",
      },
    },
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "course",
    timestamps: false,
  }
);

export class CurriculumModel extends Model {
  id: number;
  program_id: number;
  tags: string;
  state: string;
  year: number;
}

export type CurriculumStatic = typeof CurriculumModel & {
  new (values?: object, options?: BuildOptions): CurriculumModel;
};

export const Curriculum = <CurriculumStatic>sequelize.define(
  "curriculum",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    program_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "program",
        key: "id",
      },
      unique: true,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
  },
  {
    tableName: "curriculum",
    timestamps: false,
  }
);

export class GroupCourseByTermModel extends Model {
  label: "string";
  value: number;
}

export type GroupCourseByTermStatic = typeof GroupCourseByTermModel & {
  new (values?: object, options?: BuildOptions): GroupCourseByTermModel;
};

export const GroupCourseByTerm = <GroupCourseByTermStatic>sequelize.define(
  "statisticTerm",
  {
    distribution: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
    dist_range: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    student_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fail_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    drop_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    count_by_delay: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    course_code: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    semester: {
      type: DataTypes.TEXT,
      allowNull: true,
      primaryKey: true,
    },
  },
  {
    tableName: "group_course_academic_by_term",
    timestamps: false,
  }
);

export class HistoryModel extends Model {
  student_id: string;
  course_id: number;
  grade: number;
  registration: string;
  state: string;
  code_validation: string[];
}

export type HistoryStatic = typeof HistoryModel & {
  new (values?: object, options?: BuildOptions): HistoryModel;
};

export const History = <HistoryStatic>sequelize.define(
  "history_academic_course",
  {
    student_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "student",
        key: "id",
      },
    },
    course_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "course",
        key: "id",
      },
    },
    grade: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    registration: {
      type: DataTypes.TEXT,
      allowNull: true,
      primaryKey: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    code_validation: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
    },
    semester: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: true,
    },
  },
  {
    tableName: "history_academic_course",
    timestamps: false,
  }
);

export class ParameterModel extends Model {
  passing_grade: number;
  loading_date: Date;
}

export type ParameterStatic = typeof ParameterModel & {
  new (values?: object, options?: BuildOptions): ParameterModel;
};

export const Parameter = <ParameterStatic>sequelize.define(
  "parameter",
  {
    passing_grade: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    loading_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "parameter",
    timestamps: false,
  }
);

Parameter.removeAttribute("id");

export class ProgramCourseModel extends Model {
  id: number;
  program_term_id: number;
  course_id: number;
  requisites: string;
  area: string;
  state: string;
}

export type ProgramCourseStatic = typeof ProgramCourseModel & {
  new (values?: object, options?: BuildOptions): ProgramCourseModel;
};

export const ProgramCourse = <ProgramCourseStatic>sequelize.define(
  "program_course",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    program_term_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "program_term",
        key: "id",
      },
    },
    course_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "course",
        key: "id",
      },
    },
    requisites: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    area: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "program_course",
    timestamps: false,
  }
);

export class ProgramTermModel extends Model {
  id: number;
  position: number;
  name: string;
  tags: string;
  curriculum_id: number;
}

export type ProgramTermStatic = typeof ProgramTermModel & {
  new (values?: object, options?: BuildOptions): ProgramTermModel;
};

export const ProgramTerm = <ProgramTermStatic>sequelize.define(
  "program_term",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    curriculum_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "curriculum",
        key: "id",
      },
      unique: true,
    },
  },
  {
    tableName: "program_term",
    timestamps: false,
  }
);

export class ProgramModel extends Model {
  id: number;
  name: string;
  desc: string;
  state: string;
}

export type ProgramStatic = typeof ProgramModel & {
  new (values?: object, options?: BuildOptions): ProgramModel;
};

export const Program = <ProgramStatic>sequelize.define(
  "program",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "program",
    timestamps: false,
  }
);

export class GroupCourseByCohortModel extends Model {
  label: "string";
  value: number;
}

export type GroupCourseByCohortStatic = typeof GroupCourseByCohortModel & {
  new (values?: object, options?: BuildOptions): GroupCourseByCohortModel;
};

export const GroupCourseByCohort = <GroupCourseByCohortStatic>sequelize.define(
  "statisticCohort",
  {
    course_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    distribution: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
    dist_range: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    student_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fail_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    drop_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    count_by_delay: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "group_course_academic_by_cohort",
    timestamps: false,
  }
);

export class GroupCourseAcademicModel extends Model {
  label: "string";
  value: number;
}

export type GroupCourseAcademicStatic = typeof GroupCourseAcademicModel & {
  new (values?: object, options?: BuildOptions): GroupCourseAcademicModel;
};

export const GroupCourseAcademic = <GroupCourseAcademicStatic>sequelize.define(
  "statistic",
  {
    course_code: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    distribution: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
    dist_range: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    student_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fail_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    drop_rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    count_by_delay: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "group_course_academic",
    timestamps: false,
  }
);

export class StudentCurriculumModel extends Model {
  student_id: string;
  year: number;
  curriculum_id: number;
}

export type StudentCurriculumStatic = typeof StudentCurriculumModel & {
  new (values?: object, options?: BuildOptions): StudentCurriculumModel;
};

export const StudentCurriculum = <StudentCurriculumStatic>sequelize.define(
  "student_curriculum",
  {
    student_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "student",
        key: "id",
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    curriculum_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "curriculum",
        key: "id",
      },
    },
  },
  {
    tableName: "student_curriculum",
    timestamps: false,
  }
);

export class StudentDropoutModel extends Model {
  student_id: string;
  prob_dropout: number;
  model_accuracy: number;
  weight_per_semester: string;
  active: boolean;
}

export type StudentDropoutStatic = typeof StudentDropoutModel & {
  new (values?: object, options?: BuildOptions): StudentDropoutModel;
};

export const StudentDropout = <StudentDropoutStatic>sequelize.define(
  "student_dropout",
  {
    student_id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "student",
        key: "id",
      },
    },
    prob_dropout: {
      type: DataTypes.REAL,
    },
    model_accuracy: {
      type: DataTypes.REAL,
    },
    weight_per_semester: {
      type: DataTypes.TEXT,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "student_dropout",
    timestamps: false,
  }
);

export class StudentStatisticByTermModel extends Model {
  student_id: string;
  termAvg: number;
  accAvg: number;
  programAccAvg: number;
  situation: string;
  state: string;
  year: number;
  semester: string;
}

export type StudentStatisticByTermStatic = typeof StudentStatisticByTermModel & {
  new (values?: object, options?: BuildOptions): StudentStatisticByTermModel;
};

export const StudentStatisticByTerm = <StudentStatisticByTermStatic>(
  sequelize.define(
    "statistic_student_term",
    {
      student_id: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      termAvg: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      accAvg: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      programAccAvg: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      situation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      state: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
      },
      semester: {
        type: DataTypes.TEXT,
        primaryKey: true,
        allowNull: true,
      },
    },
    {
      tableName: "student_statistic_by_term",
      timestamps: false,
    }
  )
);

export class StudentModel extends Model {
  id: string;
  name: string;
  state: string;
}

export type StudentStatic = typeof StudentModel & {
  new (values?: object, options?: BuildOptions): StudentModel;
};

export const Student = <StudentStatic>sequelize.define(
  "student",
  {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "student",
    timestamps: false,
  }
);

Student.hasMany(StudentCurriculum, { foreignKey: "student_id" });
Student.hasMany(History, { foreignKey: "student_id" });
Student.hasMany(StudentStatisticByTerm, { foreignKey: "student_id" });
Student.hasOne(StudentDropout, { foreignKey: "student_id" });

Curriculum.belongsTo(Program, { foreignKey: "program_id" });
Curriculum.hasMany(ProgramTerm, { foreignKey: "curriculum_id" });
Curriculum.hasMany(StudentCurriculum, {
  foreignKey: "curriculum_id",
});

StudentDropout.belongsTo(Student, { foreignKey: "student_id" });
StudentCurriculum.belongsTo(Student, { foreignKey: "student_id" });
StudentCurriculum.belongsTo(Curriculum, { foreignKey: "curriculum_id" });

GroupCourseByCohort.belongsTo(Course, { foreignKey: "course_id" });

StudentStatisticByTerm.belongsToMany(Student, { through: "student_id" });
ProgramTerm.belongsTo(Curriculum, { foreignKey: "curriculum_id" });
ProgramTerm.hasMany(ProgramCourse, { foreignKey: "program_term_id" });

ProgramCourse.belongsTo(ProgramTerm, {
  foreignKey: "program_term_id",
});
ProgramCourse.belongsTo(Course, { foreignKey: "course_id" });

History.belongsTo(Student, { foreignKey: "student_id" });
History.belongsTo(Course, { foreignKey: "course_id" });

History.hasOne(StudentStatisticByTerm, {
  foreignKey: "student_id",
  scope: {
    year: where(
      col("history_academic_course.year"),
      "=",
      col("statistic_student_term.year")
    ),
    semester: where(
      col("history_academic_course.semester"),
      "=",
      col("statistic_student_term.semester")
    ),
  },
});

Course.hasMany(ProgramCourse, { foreignKey: { name: "course_id" } });

Course.hasMany(History, { foreignKey: "course_id" });
Course.hasMany(GroupCourseByCohort, { foreignKey: "course_id" });

Course.hasOne(GroupCourseAcademic, {
  foreignKey: "course_code",
  sourceKey: "code",
});
Course.hasMany(GroupCourseByTerm, {
  foreignKey: "course_code",
  sourceKey: "code",
});
