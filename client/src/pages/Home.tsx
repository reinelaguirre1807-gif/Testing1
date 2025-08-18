import { useState } from "react";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import TransactionModal from "@/components/TransactionModal";

export default function Home() {
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  return (
    <Layout onShowTransactionModal={() => setShowTransactionModal(true)}>
      <Dashboard />
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
    </Layout>
  );
}
