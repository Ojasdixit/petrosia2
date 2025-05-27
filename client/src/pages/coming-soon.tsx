
import { Helmet } from "react-helmet";

export default function ComingSoonPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>Coming Soon | Petrosia Pet Marketplace</title>
      </Helmet>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon!</h1>
      <p className="text-gray-600 text-center max-w-md">
        Our iOS app is currently under development. We'll notify you as soon as it's available on the App Store!
      </p>
    </div>
  );
}
