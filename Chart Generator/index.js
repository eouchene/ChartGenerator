// import all required modules
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


// setting up the server
const app = express();
const port = 3000;
// chart API URL, create chart with external API
const API_URL = "https://quickchart.io/chart?width=500&height=300&chart="


// add relative folder
app.use(express.static("public"));  
// enable using body parser
app.use(bodyParser.urlencoded({ extended: true }));


// set get route
app.get("/", async (req, res) => {
      res.render("index.ejs", {data: ""}); 
    //   data doesn't exist yet, render empty string
  });


// set post route
  app.post("/", async (req, res) => {
    let type = req.body.type; //output will be the selected option within form

    //set key:value pairs required for chart generation, defined on quick chart page
    let chartConfig = {
        type: type,
        data: {
            labels: [req.body.label1, req.body.label2, req.body.label3, req.body.label4, req.body.label5],
            datasets: [
                {
                    label: req.body.datasetlabel1,
                    data: [req.body.datasetdata1, req.body.datasetdata2, req.body.datasetdata3, req.body.datasetdata4, req.body.datasetdata5],
                    fill: false,
                    datalabels: {
                        anchor: 'center',
                        align: 'center',
                        color: 'black',
                        font: {
                          weight: 'normal'
                        }}
                },
                {
                    label: req.body.datasetlabel2,
                    data: [req.body.datasetdata2_1, req.body.datasetdata2_2, req.body.datasetdata2_3, req.body.datasetdata2_4, req.body.datasetdata2_5],
                    fill: false,
                    datalabels: {
                        anchor: 'center',
                        align: 'center',
                        color: 'black',
                        font: {
                          weight: 'normal'
                        }}
                }
            ]
        },
        options: {
            plugins: {
              datalabels: {
                display: true
              }
            }
          }
    };

    const chartUrl = API_URL + "c=" + encodeURIComponent(JSON.stringify(chartConfig));
    // encodeURIComponent pretvara znakovejson objekta u specijalne znakove koji su podržani u URL adresama
    //npr bez ovoga zagrade i neki znakovi ne bi bili podržani
    //JSON stringify pretvara JS objekat u Json objekat, kako bi se mogao koristiti u URL formatu


    // ArrayBuffer koristi se za obradu sirovih binarnih podataka, kao što su slike.
    try {
        const response = await axios.get(chartUrl, { responseType: 'arraybuffer' });
        const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
        //pretvaranje odgovora u binarnom sistemu u base64 string
        //binarni sistem ne bi mozda bio ispravno renderovan na stranici, a base64 je podržan u potpunosti
        // da se ne bi slika dohvaćala pomocu url adrese, pretvaram je iz binarnog sistema u base64 
        const imageDataUrl = `data:image/png;base64,${imageBase64}`; //na ovaj način se radi pretvaranje u base64
        res.render("index.ejs", { data: imageDataUrl }); 
    } catch (error) {
        console.error(error.response);
        res.status(500).send('An error occurred');
    }

   })


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
