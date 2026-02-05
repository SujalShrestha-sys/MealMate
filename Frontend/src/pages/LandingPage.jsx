import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/landing/HeroSection';
import RolesSection from '../components/landing/RolesSection';
import RevolutionizingSection from '../components/landing/RevolutionizingSection';
import StreamliningSection from '../components/landing/StreamliningSection';
import MealTimeSection from '../components/landing/MealTimeSection';
import SubscriptionSection from '../components/landing/SubscriptionSection';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <HeroSection />
                <RolesSection />
                <RevolutionizingSection />
                <StreamliningSection />
                <MealTimeSection />
                <SubscriptionSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
