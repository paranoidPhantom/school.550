import { useToast } from "#imports";

export const useFeedbackRequest = () => {
	const toast = useToast();

	toast.add({
		timeout: 0,
		title: "Нашли баг, или недоработку?",
		icon: "fluent-emoji:gear",
		description: "Пожалуйста, сообщите об этом!",
		id: "bug_feedback",
		actions: [
			{
				label: "Почта",
				to: "mailto:andrei@hudalla.dev",
			},
		],
	});
};
