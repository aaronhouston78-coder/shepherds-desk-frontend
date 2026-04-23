export const TOOL_CONFIGS = {
  sermon: {
    label: "Sermon Builder",
    tagline: "Structure your message with clarity and strength.",
    fields: [
      { id: "scripture", label: "Scripture Reference", placeholder: "e.g. Romans 8:28, John 11:1-44", type: "text", required: true },
      { id: "title", label: "Sermon Title", placeholder: "e.g. When God Seems Late", type: "text", required: true },
      { id: "topic", label: "Main Topic or Theme", placeholder: "e.g. Faith during delay, trusting God's timing", type: "text", required: true },
      { id: "tone", label: "Preaching Tone", type: "select", required: true, options: ["Prophetic", "Pastoral", "Teaching", "Evangelistic", "Revivalist", "Exhortative"] },
      { id: "audience", label: "Audience", type: "select", required: true, options: ["General congregation", "Men's ministry", "Women's ministry", "Youth", "New believers", "Leaders"] },
      { id: "style", label: "Structure Style", type: "select", required: true, options: ["3-point expository", "Narrative", "Topical", "Textual", "Verse-by-verse"] },
    ],
  },
  "bible-study": {
    label: "Bible Study Builder",
    tagline: "Craft a lesson your group can dig into.",
    fields: [
      { id: "scripture", label: "Scripture Reference", placeholder: "e.g. Psalm 23, Matthew 5:1-12", type: "text", required: true },
      { id: "topic", label: "Lesson Topic", placeholder: "e.g. The Shepherd's care, Beatitudes", type: "text", required: true },
      { id: "audience", label: "Audience", type: "select", required: true, options: ["General adult group", "Men's group", "Women's group", "Youth group", "New believers class", "Leadership class"] },
      { id: "tone", label: "Teaching Tone", type: "select", required: true, options: ["Practical", "Devotional", "Academic", "Conversational", "Expository"] },
      { id: "depth", label: "Teaching Depth", type: "select", required: true, options: ["Introductory", "Moderate", "In-depth", "Advanced"] },
    ],
  },
  announcement: {
    label: "Announcement Builder",
    tagline: "Polished church copy, ready to publish.",
    fields: [
      { id: "eventName", label: "Event Name", placeholder: "e.g. Kingdom Harvest Revival Night", type: "text", required: true },
      { id: "date", label: "Date", placeholder: "e.g. Saturday, June 14", type: "text", required: true },
      { id: "time", label: "Time", placeholder: "e.g. 6:00 PM", type: "text", required: true },
      { id: "location", label: "Location", placeholder: "e.g. Main Sanctuary, 119 McMullen St", type: "text", required: true },
      { id: "emphasis", label: "Key Emphasis or Call to Action", placeholder: "e.g. Bring a friend. Free community event.", type: "text", required: true },
      { id: "speaker", label: "Speaker or Officiant (optional)", placeholder: "e.g. Pastor Aaron Houston", type: "text", required: false },
      { id: "attire", label: "Attire (optional)", placeholder: "e.g. Business casual", type: "text", required: false },
    ],
  },
  caption: {
    label: "Caption Builder",
    tagline: "Ministry-worthy social content, every time.",
    fields: [
      { id: "subject", label: "Sermon Title, Theme, or Scripture", placeholder: "e.g. Don't Miss God / John 11 / Overflow", type: "text", required: true },
      { id: "audience", label: "Target Audience", type: "select", required: true, options: ["General church audience", "Unbelievers / seekers", "Youth", "Women", "Men", "Leaders"] },
      { id: "platform", label: "Primary Platform", type: "select", required: true, options: ["Instagram", "Facebook", "X (Twitter)", "TikTok / Reels", "All platforms"] },
      { id: "tone", label: "Post Tone", type: "select", required: true, options: ["Encouraging", "Prophetic declaration", "Conversational", "Challenge-based", "Devotional", "Promotional"] },
      { id: "goal", label: "Post Goal", type: "select", required: true, options: ["Drive Sunday attendance", "Share a truth / insight", "Promote an event", "Encourage engagement", "Inspire sharing"] },
    ],
  },
  "follow-up": {
    label: "Follow-Up Builder",
    tagline: "Pastoral messages that connect and welcome.",
    fields: [
      { id: "recipient", label: "Recipient Type", type: "select", required: true, options: ["First-time church guest", "Returning guest", "New member", "Volunteer", "Prayer request response", "Event attendee", "Absent member"] },
      { id: "occasion", label: "Occasion or Context", placeholder: "e.g. Attended Sunday service, Submitted prayer request", type: "text", required: true },
      { id: "tone", label: "Message Tone", type: "select", required: true, options: ["Warm and welcoming", "Pastoral and caring", "Encouraging", "Inviting", "Official but kind"] },
      { id: "church", label: "Church Name", placeholder: "e.g. Kingdom Harvest Ministries", type: "text", required: true },
      { id: "pastor", label: "Sender Name", placeholder: "e.g. Pastor Aaron Houston", type: "text", required: true },
    ],
  },
};

export function validateForm(toolId, form) {
  const config = TOOL_CONFIGS[toolId];
  if (!config) return { valid: false, errors: { _: "Unknown tool." } };
  const errors = {};
  for (const field of config.fields) {
    if (!field.required) continue;
    const val = (form[field.id] || "").trim();
    if (!val) {
      errors[field.id] = field.type === "select"
        ? `Please select a ${field.label.toLowerCase()}.`
        : `${field.label} is required.`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
