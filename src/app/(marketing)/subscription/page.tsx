import { HeaderSection, SubscriptionForm } from "./_component";

const SubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <HeaderSection />

      <SubscriptionForm />
    </div>
  );
};

export default SubscriptionPage;
