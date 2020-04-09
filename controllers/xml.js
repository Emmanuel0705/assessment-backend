const catchAsync = require("../util/catchAsync")
const xml = require("xml")

exports.xmlResponse = catchAsync(async (req,res,next) => {
        // challenge 1
const currentlyInfected = (data) => {
    data[1].estimate[0].impact.push({currentlyInfected:Math.trunc((data[0].data[3].reportedCases) * 10)})
    data[1].estimate[1].severeImpact.push({currentlyInfected: (data[0].data[3].reportedCases) * 50});
    return data;
  };
  const infectionsByRequestedTime = (data) => {
    if (data[0].data[1].periodType === 'months') data[0].data[2].timeToElapse *= 30;
    if (data[0].data[1].periodType === 'weeks') data[0].data[2].timeToElapse *= 7;
    data[1].estimate[0].impact.push({infectionsByRequestedTime: Math.trunc(data[1].estimate[0].impact[0].currentlyInfected * 1)
    * (2 ** Math.trunc(data[0].data[2].timeToElapse / 3))});
    data[1].estimate[1].severeImpact.push({ infectionsByRequestedTime : Math.trunc(data[1].estimate[1].severeImpact[0].currentlyInfected * 1)
    * (2 ** Math.trunc(data[0].data[2].timeToElapse / 3))});
    return data;
  };
  // challenge 2
  const severeCasesByRequestedTime = (data) => {
    data[1].estimate[0].impact.push({severeCasesByRequestedTime: Math.trunc(data[1].estimate[0].impact[1].infectionsByRequestedTime * 0.15)});
    data[1].estimate[1].severeImpact.push({severeCasesByRequestedTime: Math.trunc(data[1].estimate[1].severeImpact[1].infectionsByRequestedTime * 0.15)});
    return data
  };
  const hospitalBedsByRequestedTime = (data) => {
    data[1].estimate[0].impact.push({hospitalBedsByRequestedTime: Math.trunc(data[1].estimate[0].impact[2].severeCasesByRequestedTime
    - data[0].data[4].totalHospitalBeds)});
    data[1].estimate[1].severeImpact.push({hospitalBedsByRequestedTime: Math.trunc(data[1].estimate[1].severeImpact[2].severeCasesByRequestedTime
    - data[0].data[4].totalHospitalBeds)});
    return data;
  };
  // challenge 3
  const casesForICUByRequestedTime = (data) => {
    data[1].estimate[0].impact.push({casesForICUByRequestedTime: Math.trunc(data[1].estimate[0].impact[1].infectionsByRequestedTime * 0.05)});
    data[1].estimate[1].severeImpact.push({casesForICUByRequestedTime: Math.trunc(data[1].estimate[1].severeImpact[1].infectionsByRequestedTime * 0.05)});
    return data
  };
  const casesForVentilatorsByRequestedTime = (data) => {
    data[1].estimate[0].impact.push({casesForVentilatorsByRequestedTime: Math.trunc(data[1].estimate[0].impact[1].infectionsByRequestedTime * 0.02)});
    data[1].estimate[1].severeImpact.push({casesForVentilatorsByRequestedTime: Math.trunc(data[1].estimate[1].severeImpact[1].infectionsByRequestedTime * 0.02)});
    return data;
  };
  const dollarsInFlight = (data) => {
    if (data[0].data[1].periodType === 'months') data[0].data[2].timeToElapse *= 30;
    if (data[0].data[1].periodType === 'weeks') data[0].data[2].timeToElapse *= 7;
    data[1].estimate[0].impact.push({dollarsInFlight: Math.trunc((data[1].estimate[0].impact[1].infectionsByRequestedTime * 1)
    * (data[0].data[0].region[2].avgDailyIncomePopulation * 1) * (data[0].data[0].region[1].avgDailyIncomeInUSD * 1)
    * (data[0].data[2].timeToElapse * 1))});
    data[1].estimate[1].severeImpact.push({dollarsInFlight: Math.trunc((data[1].estimate[1].severeImpact[1].infectionsByRequestedTime)
    * (data[0].data[0].region[2].avgDailyIncomePopulation * 1) * (data[0].data[0].region[1].avgDailyIncomeInUSD * 1)
    * (data[0].data[2].timeToElapse * 1))})
    return data
  };
  const chalenges = (data) => {
    // challenge 1
    currentlyInfected(data);
    infectionsByRequestedTime(data);
    // challenge 2
    severeCasesByRequestedTime(data);
    hospitalBedsByRequestedTime(data);
    // challenge 3
    casesForICUByRequestedTime(data);
    casesForVentilatorsByRequestedTime(data);
    dollarsInFlight(data);
    return data;
  };
  const {name,avgDailyIncomeInUSD, avgDailyIncomePopulation, avgAge,periodType,timeToElapse,
reportedCases,totalHospitalBeds,population} = req.body
    const data = [{
        data: [
          {region:[{name}, {avgDailyIncomeInUSD}, {avgDailyIncomePopulation}, {avgAge}]},
          {periodType}, {timeToElapse}, {reportedCases}, {totalHospitalBeds}, {population}
        ],
        },
        {
          estimate: [{impact:[]},{severeImpact:[]}]
        }
   ]
    const response = [{response:chalenges(data)}]
    const xmlObject = [{name:"oluwatobi"},{attribute:[{age:12},{height:2.9}]}]
    res.type('application/xml')
     res.send(xml(response,{ declaration: true }))
        
})