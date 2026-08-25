/// <reference types="vite/client" />

interface SpeechRecognitionEvent extends Event {
	readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	readonly length: number;
	[index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	readonly isFinal: boolean;
	readonly length: number;
	[index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
	readonly transcript: string;
	readonly confidence: number;
}

interface SpeechRecognitionInstance {
	lang: string;
	interimResults: boolean;
	maxAlternatives: number;
	start(): void;
	stop(): void;
	onresult: ((event: SpeechRecognitionEvent) => void) | null;
	onerror: (() => void) | null;
}

interface SpeechRecognitionConstructor {
	new (): SpeechRecognitionInstance;
}

interface Window {
	SpeechRecognition?: SpeechRecognitionConstructor;
	webkitSpeechRecognition?: SpeechRecognitionConstructor;
}
