const { pipeline } = require("@xenova/transformers");

let sentimentPipeline;

(async () => {
  sentimentPipeline = await pipeline(
    "sentiment-analysis",
    "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
  );
})();

exports.analyzeSentiment = async (text) => {
  const result = await sentimentPipeline(text);
  return result[0].label;
};