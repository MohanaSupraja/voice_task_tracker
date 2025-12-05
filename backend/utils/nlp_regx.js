
// const chrono = require("chrono-node");

// const PRIORITY_KEYWORDS = {
//   high: "High",
//   urgent: "High",
//   critical: "High",
//   highest: "High",
//   low: "Low",
//   lowest: "Low",
// };

// const STATUS_KEYWORDS = {
//   "to do": "To Do",
//   "todo": "To Do",
//   "in progress": "In Progress",
//   "doing": "In Progress",
//   done: "Done",
//   completed: "Done",
//   finished: "Done",
// };

// function detectPriority(text) {
//   const lower = text.toLowerCase();
//   for (const key of Object.keys(PRIORITY_KEYWORDS)) {
//     if (lower.includes(key)) return PRIORITY_KEYWORDS[key];
//   }
//   return "Medium";
// }

// function detectStatus(text) {
//   const lower = text.toLowerCase();
//   for (const key of Object.keys(STATUS_KEYWORDS)) {
//     if (lower.includes(key)) return STATUS_KEYWORDS[key];
//   }
//   return "To Do";
// }

// function extractDueDate(text) {
//   const result = chrono.parse(text);
//   if (result && result.length > 0) {
//     return result[0].date();
//   }
//   return null;
// }

// function extractTitle(text) {
//   // Remove common lead phrases
//   let cleaned = text.replace(
//     /(create|add|make|remind me to|remind me|please|kindly|task|i need to|i have to)/gi,
//     ""
//   );

//   // Strip trailing date/prio parts
//   cleaned = cleaned.replace(
//     /(by|before|due|on)\s+.+$/gi,
//     ""
//   );

//   cleaned = cleaned.replace(
//     /(it's|it is)\s+(low|medium|high|urgent|critical)\s+priority/gi,
//     ""
//   );

//   return cleaned.trim().replace(/^to\s+/i, "");
// }

// function extractTaskData(text) {
//   const priority = detectPriority(text);
//   const status = detectStatus(text);
//   const dueDate = extractDueDate(text);
//   const title = extractTitle(text);

//   return {
//     transcript: text,
//     title: title || "",
//     priority,
//     status,
//     dueDate,
//   };
// }

// module.exports = { extractTaskData };
