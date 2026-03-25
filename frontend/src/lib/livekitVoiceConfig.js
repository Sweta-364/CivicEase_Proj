export const civicVoiceAssistant = {
  id: 'civic-issue',
  name: 'CivicEase Complaint Assistant',
  specialty: 'Municipal issue intake',
  image: '/civicease-assistant.svg',
};

export const voiceLanguages = [
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'od-IN', label: 'Odia' },
];

export function getVoiceLanguageByCode(code) {
  return voiceLanguages.find((language) => language.code === code) || voiceLanguages[0];
}
