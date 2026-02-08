import React from "react";
import { Users, Award, TrendingUp } from "lucide-react";

const TrustIndicators = () => {
    const indicators = [
        {
            icon: Users,
            value: "250+",
            label: "Happy Students"
        },
        {
            icon: Award,
            value: "99.9%",
            label: "Fresh Food"
        },
        {
            icon: TrendingUp,
            value: "15%",
            label: "Save More"
        }
    ];

    return (
        <div className="grid grid-cols-3 gap-4 pt-4">
            {indicators.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={index} className="text-center bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                            <Icon className="text-green-600" size={24} />
                        </div>
                        <div className="text-2xl font-black text-gray-900">{item.value}</div>
                        <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default TrustIndicators;
