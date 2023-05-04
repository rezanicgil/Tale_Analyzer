
const express = require("express");
const natural = require("natural");
const {removeStopwords,tur} = require("stopword");
  
const port = 5500;
const host = "127.0.0.1";
  
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/",express.static(__dirname + "/public"));


// Contractions to standard lexicons Conversion
const convertToStandard = text => {
    const data = text.split(' ');
    data.forEach((word, index) => {
        word = word.replace('ler','');
        word = word.replace('lar','');
        word = word.replace('LER','');
        word = word.replace('LAR','');
        data[index] = word;

    });
    
    return data.join(' ');
}

// LowerCase Conversion
const convertTolowerCase = text => {
    return text.toLowerCase();
}


  // Analysis Route
app.post("/feedback", (request, response) => {
  console.log(request.body);

  // NLP Logic
  // Convert all data to its standard form
  let lexData = convertToStandard(request.body.feedback);
  console.log("Lexed Data: ", lexData);


  // Convert all data to lowercase
  let lowerCaseData = lexData.toLocaleLowerCase('tr');
  console.log("LowerCase Format: ", lowerCaseData);


  // Tokenization
  const tokenizedData = lowerCaseData.split(' ');
  console.log("Tokenized Data: ", tokenizedData);

  // Remove Stopwords
  const filteredData = removeStopwords(tokenizedData, tur);
  console.log("After removing stopwords: ", filteredData);


  // create a BayesClassifier
  const taleClassifier = new natural.BayesClassifier();
  // supply a training set of data for two membership: night and day
  taleClassifier.addDocument("Araba kamyon uçak tren dozer itfaiye helikopter motor kamyonet traktör", "Taşıtlar");
  taleClassifier.addDocument("Prenses taç peri melek büyü sihir kraliçe kral prens şovalye saray padişah şato iksir cadı", "Peri Masalları");
  taleClassifier.addDocument("Kuş köpek tilki kurt karga aslan leopar yunus kaplumbağa tavşan maymun kedi", "Hayvanlar");

  // training
  taleClassifier.train();
  // new input is classified as day

  categoryResult = taleClassifier.classify(filteredData)

  response.status(200).json({
    message: "Veri Gönderildi.",
    tale_category: categoryResult
  });
});
  
  
app.listen(port,host,()=>{
    console.log(`Sunucu ${host} hostunda ve ${port} portunda çalışıyor...`);
});