export type Dropdown = Record<
	string,
	{
		index: number;
		links: {
			to: string;
			label: string;
			customIndex?: number;
		}[];
	}
>;

export type Logic =
	| Dropdown
	| {
			to: string;
	  };
