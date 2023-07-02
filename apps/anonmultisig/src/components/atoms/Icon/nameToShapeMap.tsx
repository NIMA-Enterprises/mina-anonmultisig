import React from "react";

const nameToShapeMap = {
	ARROW_LEFT: (
		<React.Fragment>
			<line x1="19" y1="12" x2="5" y2="12" />
			<polyline points="12 19 5 12 12 5" />
		</React.Fragment>
	),
	ARROW_RIGHT: (
		<React.Fragment>
			<line x1="5" y1="12" x2="19" y2="12" />
			<polyline points="12 5 19 12 12 19" />
		</React.Fragment>
	),
	ARROW_DOWN: (
		<React.Fragment>
			<line x1="12" y1="5" x2="12" y2="19" />
			<polyline points="19 12 12 19 5 12" />
		</React.Fragment>
	),
	ARROW_UP: (
		<React.Fragment>
			<line x1="12" y1="19" x2="12" y2="5" />
			<polyline points="5 12 12 5 19 12" />
		</React.Fragment>
	),
	SUN: (
		<React.Fragment>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</React.Fragment>
	),
	MOON: <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
	LOADER1: (
		<React.Fragment>
			<path d="M21 2v6h-6" />
			<path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
			<path d="M3 22v-6h6" />
			<path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
		</React.Fragment>
	),
	LOADER2: (
		<React.Fragment>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</React.Fragment>
	),
	LOADER3: (
		<React.Fragment>
			<line x1="12" y1="2" x2="12" y2="6" />
			<line x1="12" y1="18" x2="12" y2="22" />
			<line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
			<line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
			<line x1="2" y1="12" x2="6" y2="12" />
			<line x1="18" y1="12" x2="22" y2="12" />
			<line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
			<line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
		</React.Fragment>
	),
	COPY: (
		<React.Fragment>
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
		</React.Fragment>
	),
	INSTAGRAM: (
		<path
			d="M16.65 7.2H16.66M8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20ZM15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="fill-none stroke-black"
		/>
	),
	TWITTER: (
		<path
			xmlns="http://www.w3.org/2000/svg"
			d="M23.1876 5.04595C22.4181 5.3947 21.5249 5.6497 20.5896 5.7667L20.5439 5.7712C21.4949 5.19295 22.2104 4.3072 22.5591 3.2557L22.5689 3.2227C21.7259 3.72295 20.7456 4.10695 19.7039 4.3207L19.6424 4.3312C18.8001 3.43195 17.6046 2.8717 16.2786 2.8717C13.7354 2.8717 11.6736 4.93345 11.6736 7.4767C11.6736 7.8487 11.7179 8.21095 11.8011 8.55745L11.7951 8.52595C7.96038 8.33545 4.58538 6.51595 2.32338 3.75145L2.30463 3.7282C1.91313 4.38295 1.68138 5.1727 1.68138 6.0172C1.68138 6.02695 1.68138 6.0367 1.68138 6.04645V6.04495C1.68138 6.04495 1.68138 6.0472 1.68138 6.0487C1.68138 7.6387 2.48763 9.04045 3.71313 9.86846L3.72963 9.87895C2.96013 9.85345 2.24538 9.64271 1.62138 9.29021L1.64463 9.3022V9.35845V9.35995C1.64463 11.5807 3.21588 13.4355 5.30763 13.8705L5.33763 13.8757C4.97463 13.977 4.55763 14.0347 4.12713 14.0347C3.82263 14.0347 3.52563 14.0055 3.23763 13.95L3.26688 13.9545C3.87663 15.7987 5.56788 17.1135 7.57113 17.1525H7.57563C6.02163 18.381 4.03488 19.1227 1.87413 19.1227C1.87038 19.1227 1.86738 19.1227 1.86363 19.1227H1.86438C1.47813 19.122 1.09788 19.0995 0.723633 19.056L0.769383 19.0605C2.76663 20.3572 5.20938 21.1282 7.83288 21.1282C7.83663 21.1282 7.83963 21.1282 7.84338 21.1282H7.84263C7.87038 21.1282 7.90413 21.1282 7.93713 21.1282C15.1206 21.1282 20.9444 15.3045 20.9444 8.12095C20.9444 8.0917 20.9444 8.0632 20.9444 8.03395V8.03845C20.9444 7.84195 20.9444 7.64545 20.9301 7.44895C21.8376 6.79045 22.6019 6.0007 23.2116 5.09695L23.2326 5.06395L23.1876 5.04595Z"
			fill="black"
		/>
	),
	GITHUB: (
		<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
	),
	MEDIUM: (
		<React.Fragment>
			<g clipPath="url(#clip0_504_6)">
				<path
					d="M1 20.1L3.65 17.05V6.55L1.3 3.9V3.5H7.55L12.55 14.1L16.95 3.5H23V3.9L21 5.75V18.3L23 20.1V20.5H14.3V20.1L16.35 17.7V8.3L11.35 20.5H10.7L4.9 8.55V16.95L7.55 20.1V20.5H1V20.1Z"
					fill="black"
					className="stroke-none"
				/>
			</g>
			<defs>
				<clipPath id="clip0_504_6">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</React.Fragment>
	),
	TELEGRAM: (
		<path
			d="M22.4389 4.62225L19.2702 19.566C19.0309 20.6205 18.4077 20.883 17.5219 20.3865L12.6934 16.8285L10.3639 19.0695C10.1059 19.3275 9.89066 19.5428 9.39341 19.5428L9.74066 14.6258L18.6889 6.54C19.0782 6.1935 18.6042 6.00075 18.0844 6.348L7.0219 13.314L2.2594 11.823C1.22365 11.4998 1.2049 10.7873 2.4754 10.29L21.1032 3.11325C21.9657 2.79 22.7202 3.3045 22.4389 4.62225Z"
			fill="black"
			className="stroke-none"
		/>
	),
	DISCORD: (
		<path
			d="M15.744 15.1223C14.6108 15.048 13.7198 14.1105 13.7198 12.9645C13.7198 12.9263 13.7205 12.888 13.7228 12.8498V12.855C13.7205 12.819 13.719 12.777 13.719 12.7343C13.719 11.5905 14.6115 10.656 15.738 10.5878H15.744C16.8758 10.6493 17.7698 11.5815 17.7698 12.723C17.7698 12.7695 17.7683 12.8153 17.7653 12.861V12.855C17.7675 12.8925 17.769 12.9368 17.769 12.981C17.769 14.1233 16.8758 15.057 15.7493 15.1215H15.7433L15.744 15.1223ZM8.26953 15.1223C7.13628 15.048 6.24528 14.1105 6.24528 12.9645C6.24528 12.9263 6.24603 12.888 6.24828 12.8498V12.855C6.24603 12.819 6.24453 12.777 6.24453 12.7343C6.24453 11.5905 7.13703 10.656 8.26353 10.5878H8.26953C9.40128 10.6493 10.2953 11.5815 10.2953 12.723C10.2953 12.7695 10.2938 12.8153 10.2908 12.861V12.855C10.293 12.891 10.2945 12.933 10.2945 12.9758C10.2945 14.1195 9.40203 15.054 8.27553 15.1223H8.26953ZM19.7948 4.8488C18.4725 4.2248 16.9365 3.7313 15.3285 3.44555L15.2168 3.42905C15.213 3.4283 15.2085 3.42755 15.204 3.42755C15.1778 3.42755 15.1553 3.4418 15.1433 3.4628C14.9678 3.77105 14.7773 4.1558 14.6055 4.5503L14.5733 4.63355C13.8008 4.5098 12.9098 4.4393 12.0023 4.4393C11.0948 4.4393 10.2038 4.5098 9.33453 4.64555L9.43128 4.6328C9.22878 4.1603 9.03528 3.7763 8.82153 3.4043L8.85228 3.46205C8.83953 3.4403 8.81628 3.4268 8.79003 3.4268C8.78628 3.4268 8.78178 3.4268 8.77803 3.42755C7.05828 3.7298 5.52228 4.22255 4.08678 4.8953L4.20003 4.8473C4.18728 4.85255 4.17678 4.86155 4.17003 4.8728C2.02953 7.90355 0.748535 11.6745 0.748535 15.7448C0.748535 16.425 0.784535 17.0963 0.854285 17.7578L0.847535 17.6753C0.849785 17.697 0.861035 17.715 0.876785 17.7278C2.48179 18.9285 4.34779 19.896 6.36153 20.5313L6.49353 20.5673C6.49953 20.5695 6.50703 20.5703 6.51453 20.5703C6.53853 20.5703 6.55953 20.559 6.57228 20.5418C6.97353 20.0018 7.35528 19.3898 7.68603 18.7478L7.72128 18.6728C7.72578 18.6638 7.72878 18.6525 7.72878 18.6405C7.72878 18.6098 7.70928 18.5843 7.68228 18.5738H7.68153C6.99753 18.3098 6.41928 18.0285 5.86878 17.706L5.92653 17.7375C5.90478 17.7248 5.89053 17.7015 5.89053 17.6753C5.89053 17.652 5.90178 17.631 5.91903 17.6183C6.03678 17.5298 6.15528 17.4383 6.26778 17.3453C6.27978 17.3355 6.29553 17.3295 6.31203 17.3295C6.32253 17.3295 6.33228 17.3318 6.34053 17.3355H6.33978C7.99578 18.1313 9.93978 18.5963 11.9918 18.5963C14.0438 18.5963 15.9885 18.1313 17.724 17.301L17.6438 17.3355C17.6528 17.331 17.6625 17.3288 17.6738 17.3288C17.6903 17.3288 17.706 17.3348 17.718 17.3445C17.8305 17.4375 17.9483 17.5305 18.0675 17.6183C18.0848 17.6318 18.096 17.6528 18.096 17.676C18.096 17.7023 18.0818 17.7248 18.0615 17.7375C17.5658 18.0338 16.9875 18.3143 16.3853 18.546L16.3065 18.573C16.2795 18.5835 16.26 18.6098 16.26 18.6398C16.26 18.6518 16.263 18.663 16.2683 18.6728C16.644 19.3928 17.025 20.0033 17.4465 20.583L17.4165 20.5403C17.4293 20.5583 17.451 20.5703 17.4743 20.5703C17.4818 20.5703 17.4893 20.5688 17.496 20.5673C19.6448 19.8983 21.5138 18.9308 23.1698 17.6933L23.121 17.7285C23.1375 17.7165 23.148 17.6978 23.1503 17.6768C23.2155 17.0888 23.2523 16.4063 23.2523 15.7155C23.2523 11.6543 21.9683 7.89305 19.785 4.81505L19.824 4.87355C19.818 4.86155 19.8075 4.8518 19.7955 4.84655L19.7948 4.8488Z"
			fill="black"
		/>
	),
	AVAX: (
		<path
			xmlns="http://www.w3.org/2000/svg"
			d="M 10.527344 0.0976562 C 1.675781 1.238281 -2.875 11.101562 1.972656 18.648438 C 7.324219 26.976562 20.265625 25.25 23.371094 15.792969 C 26.085938 7.523438 19.101562 -1.007812 10.527344 0.0976562 Z M 12.3125 4.679688 C 12.910156 5.179688 14.433594 8.097656 14.433594 8.734375 C 14.429688 9.390625 11.125 15.480469 10.316406 16.316406 C 9.488281 17.175781 5.121094 17.105469 5.121094 16.234375 C 5.121094 15.949219 11.417969 4.832031 11.699219 4.617188 C 11.957031 4.421875 12.015625 4.429688 12.3125 4.679688 Z M 16.511719 11.949219 C 16.578125 12.03125 17.15625 12.992188 17.789062 14.082031 C 19.453125 16.941406 19.511719 16.847656 16.136719 16.847656 C 13.597656 16.847656 13.292969 16.78125 13.292969 16.25 C 13.292969 16.089844 14.984375 13.085938 15.644531 12.070312 C 15.839844 11.773438 16.3125 11.707031 16.511719 11.949219 Z M 16.511719 11.949219 "
		/>
	),

	LIST: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="8" y1="6" x2="21" y2="6" />
			<line x1="8" y1="12" x2="21" y2="12" />
			<line x1="8" y1="18" x2="21" y2="18" />
			<line x1="3" y1="6" x2="3.01" y2="6" />
			<line x1="3" y1="12" x2="3.01" y2="12" />
			<line x1="3" y1="18" x2="3.01" y2="18" />
		</svg>
	),

	CHECKMARK: <polyline points="20 6 9 17 4 12" />,
	CHEVRONS_UP_DOWN: (
		<React.Fragment>
			<path d="m7 15 5 5 5-5" />
			<path d="m7 9 5-5 5 5" />
		</React.Fragment>
	),
	LINE_CHART: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M3 3v18h18" />
			<path d="m19 9-5 5-4-4-3 3" />
		</svg>
	),
	BOOKMARK: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
		</svg>
	),

	EXTERNAL_LINK: (
		<React.Fragment>
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
			<polyline points="15 3 21 3 21 9" />
			<line x1="10" y1="14" x2="21" y2="3" />
		</React.Fragment>
	),
	TRANSFER: (
		<React.Fragment>
			<polyline points="17 11 21 7 17 3" />
			<line x1="21" y1="7" x2="9" y2="7" />
			<polyline points="7 21 3 17 7 13" />
			<line x1="15" y1="17" x2="3" y2="17" />
		</React.Fragment>
	),
	CART: (
		<React.Fragment>
			<circle cx="8" cy="21" r="1" />
			<circle cx="19" cy="21" r="1" />
			<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
		</React.Fragment>
	),
	FLOWER: (
		<React.Fragment>
			<path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 4.5V15" />
			<circle cx="12" cy="12" r="3" />
			<path d="m8 16 1.5-1.5" />
			<path d="M14.5 9.5 16 8" />
			<path d="m8 8 1.5 1.5" />
			<path d="M14.5 14.5 16 16" />
		</React.Fragment>
	),
};

export { nameToShapeMap };
