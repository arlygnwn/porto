import { Metadata } from 'next';
import CommissionClient from './CommissionClient';

export const metadata: Metadata = {
    title: "Arly | Commission",
    description: "Accepting freelance projects and commissions for backend infrastructure, custom API development, and DevOps automation.",
    openGraph: {
        title: "Arly | Commission",
        description: "Accepting freelance projects and commissions for backend infrastructure, custom API development, and DevOps automation.",
        url: "https://arly.tigaempat.com/commission",
    }
};

export default function CommissionPage() {
    return <CommissionClient />;
}
