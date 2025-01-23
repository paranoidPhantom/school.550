export type Dropdown = {
	column: string;
	data: {
		index: number;
		links: {
			to: string;
			label: string;
			customIndex?: number;
		}[];
	};
}[];

export type Logic =
	| Dropdown
	| {
			to: string;
	  };
