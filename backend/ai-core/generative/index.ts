const openai = require('openai');
const prompt = "Stwórz komponent React Button z propsami: text, onClick";
openai.createCompletion({
  model: "gpt-4",
  prompt
}).then(res => {
  console.log(res.data.choices?.[0]?.text);
});
