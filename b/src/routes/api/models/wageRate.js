export const wageRate = {
  employmentType: {
    probationary: {
      rules: {
        ordinary: {
          dayOff: "0%",
          duty: "100%",
          overTime: "125%",
          type: "probationary",
        },
        special: {
          dayOff: "0%",
          duty: "125%",
          overTime: "125%",
          type: "probationary",
        },
        regular: {
          dayOff: "0%",
          duty: "125%",
          overTime: "125%",
          type: "probationary",
        },
        dayOff: {
          dayOff: "0%",
          duty: "125%",
          overTime: "125%",
          type: "probationary",
        },
        dayOffSpecial: {
          dayOff: "0%",
          duty: "125%",
          overTime: "125%",
          type: "probationary",
        },
        dayOffRegular: {
          dayOff: "0%",
          duty: "125%",
          overTime: "125%",
          type: "probationary",
        },
      },
    },
    regular: {
      rules: {
        ordinary: {
          dayOff: "0%",
          duty: "100%",
          overTime: "125%",
          type: "regular",
          day: "ordinary",
        },
        special: {
          dayOff: "0%",
          duty: "130%",
          overTime: "125%",
          type: "regular",
          day: "special",
        },
        regular: {
          dayOff: "0%",
          duty: "130%",
          overTime: "125%",
          type: "regular",
          day: "regular",
        },
        dayOff: {
          dayOff: "0%",
          duty: "130%",
          overTime: "125%",
          type: "regular",
          day: "dayOff",
        },
        dayOffSpecial: {
          dayOff: "0%",
          duty: "150%",
          overTime: "125%",
          type: "regular",
          day: "dayOffSpecial",
        },
        dayOffRegular: {
          dayOff: "0%",
          duty: "150%",
          overTime: "125%",
          type: "regular",
          day: "dayOffRegular",
        },
      },
    },
  },

  sss: {
    monthlySalary14999: {
      rules: {
        EE: "4.5%",
        ER: "9.5%",
        EC: "10",
        type: "monthlySalary14999",
      },
    },
    monthlySalary15000: {
      rules: {
        EE: "4.5%",
        ER: "9.5%",
        EC: "30",
        type: "monthlySalary15000",
      },
    },
    monthlySalary30000: {
      rules: {
        EE: "4.5%",
        ER: "9.5%",
        EC: "30",
        WISP: "",
        type: "monthlySalary30000",
      },
    },
  },
  pagIbig: { rules: { EE: "100", ER: "100" } },
  philHealth: { rules: { EE: "250", ER: "250" } },
};
