const csvtojson = require("csvtojson");
const fs = require("fs");
XLSX = require('xlsx');

// get arguments from user
const inputArgsArray = new Array();
process.argv.forEach(function (val, i) {
  // skip first second since they are file name and path, first argument starts at index 2
  if (i >= 2) {
    const obj = {
      index: i - 2,
      arg: val,
    };
    inputArgsArray.push(obj);
  }
});

let fileInputName = inputArgsArray[0].arg;
let fileOutputName = inputArgsArray[1].arg;

const workBook = XLSX.readFile(fileInputName);
XLSX.writeFile(workBook, 'data.csv', { bookType: "csv" });


// using external lib csvtojson to process the data
csvtojson({ checkType: true })
  .fromFile('data.csv')
  .then((source) => {

    // source.reduce((prev, curr, ix) => {
    //   console.log('prev: ', prev,'curr: ', curr,'ix: ', ix)
    //   return curr
    // },0)

    // define arrays
    let samplesArray = new Array();
    let blockArray = new Array();
    let metadataArray = new Array();
    for (let i = 0; i < source.length; i++) {
      let first = source[i]["č.vz."],
        second = source[i]["pH"],
        third = source[i]["P"],
        fourth = source[i]["K"],
        fifth = source[i]["Mg"],
        sixth = source[i]["Ca"],
        seventh = source[i]["S"],
        eight = source[i]["Oh"],
        ninth = source[i]["K / Mg"],
        tenth = source[i]["DP"],
        eleventh = source[i]["DVK"],
        twelfth = source[i]["PD"];

      // console.table({value: first_value, type: typeof first_value, has_value: first_value.length > 0,i: i});

      if (typeof first === "string") {}

      // get only sample numbers
      // push sample numbers to separate an array
      if (typeof first === "number") {
        sample_number = first;
        pH = second;
        P = third;
        K = fourth;
        Mg = fifth;
        Ca = sixth;
        S = seventh;
        Oh = eight;
        K_MG = ninth;
        DP = tenth;
        DVK = eleventh;
        PD = twelfth;

        let values = {
          // i,
          sample_number,
          pH,
          P,
          K,
          Mg,
          Ca,
          S,
          Oh,
          K_MG,
          DP,
          DVK,
          PD,
        };
        samplesArray.push(values);
      }

      // get only blocks
      // push block to separate an array
      if (typeof first === "string" && first.length > 0) {
        block_type = first;
        pH_avg = second;
        P_avg = third;
        K_avg = fourth;
        Mg_avg = fifth;
        Ca_avg = sixth;
        S_avg = seventh;
        Oh_avg = eight;
        K_MG_avg = ninth;
        DP_avg = tenth;
        DVK_avg = eleventh;
        PD_avg = twelfth;

        let values = {
          pH_avg,
          P_avg,
          K_avg,
          Mg_avg,
          Ca_avg,
          S_avg,
          Oh_avg,
          K_MG_avg,
          DP_avg,
          DVK_avg,
          PD_avg,
        };

        blockArray.push({ block_type, averages: { ...values } });
      }

      // get only metadata
      // push metadata to separate an array
      if (first.length === 0 && second.length > 0) {
        let values = {
          first,
          second,
          third,
          fourth,
          fifth,
          sixth,
          seventh,
          eight,
          ninth,
          tenth,
          eleventh,
          twelfth,
        };
        metadataArray.push({ meta: { ...values } });
      }
    }

    // merge blocks with meta data
    // merge based on index as they are the same
    for (let [inx, value] of metadataArray.entries()) {
      blockArray[inx] = { ...blockArray[inx], ...value };
    }

    let data = JSON.stringify([...samplesArray, ...blockArray]);
    fs.writeFileSync(fileOutputName, data);

  });
