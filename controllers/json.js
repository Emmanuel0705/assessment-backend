const catchAsync = require("../util/catchAsync")

exports.jsonResponse = catchAsync(async (req,res,next) => {
    // challenge 1
const currentlyInfected = ({ data,impact,severeImpact }) => {
    impact.currentlyInfected = (data.reportedCases * 1) * 10;
    severeImpact.currentlyInfected = (data.reportedCases * 1) * 50;
    return { impact, severeImpact };
  };
  const infectionsByRequestedTime = ({ data, impact, severeImpact }) => {
    if (data.periodType === 'months') data.timeToElapse *= 30;
    if (data.periodType === 'weeks') data.timeToElapse *= 7;
    impact.infectionsByRequestedTime = Math.trunc((impact.currentlyInfected * 1)
    * (2 ** Math.trunc(data.timeToElapse / 3)));
    severeImpact.infectionsByRequestedTime = Math.trunc((severeImpact.currentlyInfected * 1)
    * (2 ** Math.trunc(data.timeToElapse / 3)));
    return { impact, severeImpact };
  };
  // challenge 2
  const severeCasesByRequestedTime = ({ impact, severeImpact }) => {
    impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.15);
    severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.15);
    return { impact, severeImpact };
  };
  const hospitalBedsByRequestedTime = ({ data, impact, severeImpact }) => {
    impact.hospitalBedsByRequestedTime = Math.trunc(impact.severeCasesByRequestedTime
    - data.totalHospitalBeds);
    severeImpact.hospitalBedsByRequestedTime = Math.trunc(severeImpact.severeCasesByRequestedTime
    - data.totalHospitalBeds);
    return { impact, severeImpact };
  };
  // challenge 3
  const casesForICUByRequestedTime = ({ impact, severeImpact }) => {
    impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.05);
    severeImpact.casesForICUByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.05);
    return { impact, severeImpact };
  };
  const casesForVentilatorsByRequestedTime = ({ impact, severeImpact }) => {
    impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);
    severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.05);
    return { impact, severeImpact };
  };
  const dollarsInFlight = ({ data, impact, severeImpact }) => {
    if (data.periodType === 'months') data.timeToElapse *= 30;
    if (data.periodType === 'weeks') data.timeToElapse *= 7;
    impact.dollarsInFlight = Math.trunc(impact.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD
    * data.timeToElapse);
    severeImpact.dollarsInFlight = Math.trunc(severeImpact.infectionsByRequestedTime
    * data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD
    * data.timeToElapse);
    return { impact, severeImpact };
  };
  const chalenges = ({ data, impact, severeImpact }) => {
    // challenge 1
    currentlyInfected({ data, impact, severeImpact });
    infectionsByRequestedTime({ data, impact, severeImpact });
    // challenge 2
    severeCasesByRequestedTime({ impact, severeImpact });
    hospitalBedsByRequestedTime({ data, impact, severeImpact });
    // challenge 3
    casesForICUByRequestedTime({ impact, severeImpact });
    casesForVentilatorsByRequestedTime({ impact, severeImpact });
    dollarsInFlight({ data, impact, severeImpact });
    const datas = {data,estimate:{impact,severeImpact}}
    return datas;
  };
  const {name,avgDailyIncomeInUSD, avgDailyIncomePopulation, avgAge,periodType,timeToElapse,
reportedCases,totalHospitalBeds,population} = req.body
    const data = {
        data: {
          region:{ name, avgDailyIncomeInUSD, avgDailyIncomePopulation, avgAge, },
          periodType, timeToElapse, reportedCases, totalHospitalBeds, population
        },
          impact:{},
          severeImpact:{}       
    }
    res.json(chalenges(data))
       
})