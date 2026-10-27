// Helper utility for browser SpeechSynthesis to play realistic assistant audios

export const playAssistantAudio = (
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate = 1.0,
  pitch = 1.05
): (() => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    alert('Tu navegador no soporta síntesis de voz, pero puedes copiar y enviar el guion por WhatsApp.');
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-US'; // Prefer US Spanish or Latin American Spanish
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Try to find a pleasant Spanish female or standard voice
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(
    v => (v.lang.startsWith('es') || v.lang.includes('es-')) && (v.name.includes('Sabina') || v.name.includes('Sofia') || v.name.includes('Monica') || v.name.includes('Paulina') || v.name.includes('Female'))
  ) || voices.find(v => v.lang.startsWith('es'));

  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
};

export const stopAssistantAudio = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const sendWhatsAppMessage = (phone: string, text: string) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank');
};
