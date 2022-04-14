chrome.runtime.onMessage.addListener(gotMessage);

var domain = "Unknown";

function arrayToCsv(data) {
  let csv = data.map((row) => row.join(";"));
  return csv;
}

function downloadBlob(content, filename, contentType) {
  // Create a blob
  var blob = new Blob([content], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement("a");
  pom.href = url;
  pom.setAttribute("download", filename);
  pom.click();
}

function getListXPath(index) {
  //   console.log(`Get row at index: ${index}`);
  let cvsRows = [];

  let question = document
    .getElementById(`div${index}`)
    .getElementsByClassName("questiontext")[0].innerHTML;
  cvsRows.push(replaceHighlight(question));
  var correctObj = { correct: true }
  let answer = generateAnswer(index, correctObj);
  let rawAnswer = generateRawAnswer(index);
  
  cvsRows.push(answer);
  cvsRows.push(rawAnswer);
  let explaination = document
    .getElementById(`div${index}`)
    .getElementsByClassName("explanation-inner")[0].innerHTML;
  cvsRows.push(explaination);

  let examName =
    document.getElementsByClassName("exam_name")[0].children[1].innerHTML;
  cvsRows.push(examName);

  cvsRows.push(correctObj.correct ? "Yes" : "No");
  cvsRows.push(domain);
  cvsRows.push(("0" + index).slice(-2));

  console.log(cvsRows);

  return cvsRows.join("|");
}

function generateCSV(data) {
  let examName =
    document.getElementsByClassName("exam_name")[0].children[1].innerHTML;
  downloadBlob(data, `${examName}.csv`, "text/csv;charset=utf-8;");
}

function generate(count) {
  var rowData = [];
  for (let i = 0; i < count; i++) {
    let dragbox = document
      .getElementById(`div${i + 1}`)
      .getElementsByClassName("dragbox");
    let fillText = document
      .getElementById(`div${i + 1}`)
      .getElementsByClassName("filltext");

    if (dragbox.length <= 0 && fillText.length <= 0) {
      let rowString = getListXPath(i + 1);

      if (i + 1 == 1) {
        rowData.push("Question|Answer|RawAnswer|Note|Exam|Correct|Domain|No");
      }
      rowData.push(rowString);
    }
  }
  rowData = rowData.join("\n");
  generateCSV(rowData);
}

function getCSVLinkElement(uri) {
  var link = document.createElement("a");
  link.textContent = "Save as CSV";
  link.download = "file.csv";
  link.href = uri;

  return link;
}

function gotMessage(message, sender, sendResponse) {
  sendResponse("Ok ban oi");
  console.log(`Receive message: ${message.msg}`);
  domain = message.msg;
  //   generate(message.msg);
  let questionCount = document
    .getElementById(`workarea`)
    .getElementsByClassName("div").length;
  generate(questionCount);
}

function replaceDoubleQuote(text) {
  return text.replaceAll(`"`, `**`).replaceAll(`&nbsp;&nbsp;&nbsp;&nbsp; `, ``)
}

function replaceHighlight(text) {
  return text
    .replaceAll(`<span class="highlighted">`, ``)
    .replaceAll(`</span>`, ``);
}

function generateAnswer(divIndex, correctObj) {
  let rows = document
    .getElementById(`div${divIndex}`)
    .getElementsByClassName("table")[0].rows;
  let answers = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].classList.contains("rightanswer")) {
      let correctAnswer = `- ✅ ${
        rows[i].getElementsByClassName("anstext")[0].innerHTML
      }`;
      answers.push(replaceDoubleQuote(correctAnswer));
      //   console.log(correctAnswer)
    } else if (rows[i].classList.contains("wronganswer")) {
      correctObj.correct = false;
      let wrongAnswer = `- ❌ ${
        rows[i].getElementsByClassName("anstext")[0].innerHTML
      }`;
      answers.push(replaceDoubleQuote(wrongAnswer));
      //   console.log(wrongAnswer)
    } else {
      let answer = `- ${
        rows[i].getElementsByClassName("anstext")[0].innerHTML
      }`;
      answers.push(replaceDoubleQuote(answer));
      //   console.log(answer)
    }
  }
  let finalAnswer = `\"${answers[0]}\n${answers[1]}\n${answers[2]}\n${answers[3]}\n\"`;
  return finalAnswer;
}

function generateRawAnswer(divIndex) {
  let rows = document
    .getElementById(`div${divIndex}`)
    .getElementsByClassName("table")[0].rows;
  let answers = [];
  for (let i = 0; i < rows.length; i++) {
    let answer = `- ${rows[i].getElementsByClassName("anstext")[0].innerHTML}`;
    answers.push(replaceDoubleQuote(answer));
  }
  let finalAnswer = `\"${answers[0]}\n${answers[1]}\n${answers[2]}\n${answers[3]}\n\"`;
  return finalAnswer;
}
