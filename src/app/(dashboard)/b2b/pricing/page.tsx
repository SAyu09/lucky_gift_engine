"use client";

import {
  Check,
  X,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Sparkles,
  Crown,
  Rocket,
} from "lucide-react";

interface PricingPlan {
  name: string;
  description: string;
  price: number | "custom";
  icon: React.ReactNode;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  cta: string;
  gradient: string;
}

export default function PricingPage() {
  const plans: PricingPlan[] = [
    {
      name: "Starter",
      description: "Perfect for testing and small projects",
      price: 49,
      icon: <Rocket className="h-6 w-6" />,
      features: [
        "Up to 10,000 spins/month",
        "Test & Live API keys",
        "Basic webhook support",
        "Email support",
        "Standard RNG engine",
        "Basic analytics dashboard",
      ],
      notIncluded: [
        "Priority support",
        "Custom probability tables",
        "Advanced analytics",
      ],
      cta: "Upgrade To Basic Plan",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Professional",
      description: "For growing businesses and serious integrations",
      price: 199,
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Up to 100,000 spins/month",
        "Test & Live API keys",
        "Advanced webhook configuration",
        "Priority email & chat support",
        "Custom probability tables",
        "Advanced analytics & reporting",
        "Multiple webhook endpoints",
        "99.9% uptime SLA",
      ],
      popular: true,
      cta: "Upgrade to Pro",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Pro",
      description: "Custom solutions for large-scale operations",
      price: 299,
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        "Unlimited spins",
        "Dedicated API infrastructure",
        "Custom webhook configurations",
        "24/7 phone & priority support",
        "Custom RNG algorithms",
        "White-label solutions",
        "Dedicated account manager",
        "Custom SLA agreements",
        "On-premise deployment options",
      ],
      cta: "Upgrade To Advance",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Scale your gaming platform with our flexible pricing. All plans
          include our provably fair RNG engine and secure API infrastructure.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
        {plans.map((plan, index) => {
          return (
            <div
              key={index}
              className={`relative bg-white dark:bg-purple-950/20 border rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col ${
                plan.popular
                  ? "border-purple-500 dark:border-purple-400 shadow-xl lg:scale-105 mt-6"
                  : "border-gray-200 dark:border-purple-500/10"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div
                    className={`px-4 py-1.5 bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1`}
                  >
                    <Zap className="h-3 w-3" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              {/* Icon */}
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.gradient} text-white mb-4 w-fit`}
              >
                {plan.icon}
              </div>

              {/* Plan Name & Description */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/mo</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 mb-6 text-sm sm:text-base ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:scale-105`
                    : "bg-gray-100 dark:bg-purple-950/30 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-purple-500/20"
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-3 flex-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  What's included
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.notIncluded && plan.notIncluded.length > 0 && (
                  <>
                    <div className="border-t border-gray-200 dark:border-purple-500/10 my-4"></div>
                    {plan.notIncluded.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 opacity-50"
                      >
                        <X className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          All Plans Include
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-lg shrink-0">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Provably Fair RNG
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cryptographically secure random number generation with full
                transparency
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-lg shrink-0">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Real-time Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track spins, payouts, and player behavior with detailed insights
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg shrink-0">
              <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Developer Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive documentation and responsive support team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Need a Custom Solution?
        </h2>
        <p className="text-purple-100 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          Our Pro plan offers tailored solutions for high-volume operations.
          Contact our sales team to discuss your specific requirements.
        </p>
        <button
          type="button"
          className="px-6 sm:px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
        >
          Schedule a Demo
        </button>
      </div>
    </div>
  );
}
