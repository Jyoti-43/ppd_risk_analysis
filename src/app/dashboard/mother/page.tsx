'use client';
import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, AlertCircle, Info, ArrowLeft, FileText } from 'lucide-react';

const PPDScreeningApp = () => {
    const [currentPage, setCurrentPage] = useState('select-method');
    const [selectedMethod, setSelectedMethod] = useState<'epds' | 'symptoms' | 'hybrid' | null>(null);
    const [epdsAnswers, setEpdsAnswers] = useState<Record<number, number>>({});
    const [symptomsAnswers, setSymptomsAnswers] = useState<Record<number, number>>({});
    const [hybridAnswers, setHybridAnswers] = useState<{ epds: Record<number, number>; symptoms: Record<number, number> }>({ epds: {}, symptoms: {} });
    const [hybridStep, setHybridStep] = useState('epds');

    const epdsQuestions = [
        { id: 1, text: "I have been able to laugh and see the funny side of things", options: ["As much as I always could", "Not quite so much now", "Definitely not so much now", "Not at all"] },
        { id: 2, text: "I have looked forward with enjoyment to things", options: ["As much as I ever did", "Rather less than I used to", "Definitely less than I used to", "Hardly at all"] },
        { id: 3, text: "I have blamed myself unnecessarily when things went wrong", options: ["Yes, most of the time", "Yes, some of the time", "Not very often", "No, never"] },
        { id: 4, text: "I have been anxious or worried for no good reason", options: ["No, not at all", "Hardly ever", "Yes, sometimes", "Yes, very often"] },
        { id: 5, text: "I have felt scared or panicky for no very good reason", options: ["Yes, quite a lot", "Yes, sometimes", "No, not much", "No, not at all"] },
        { id: 6, text: "Things have been getting on top of me", options: ["Yes, most of the time I haven't been able to cope", "Yes, sometimes I haven't been coping as well as usual", "No, most of the time I have coped quite well", "No, I have been coping as well as ever"] },
        { id: 7, text: "I have been so unhappy that I have had difficulty sleeping", options: ["Yes, most of the time", "Yes, sometimes", "Not very often", "No, not at all"] },
        { id: 8, text: "I have felt sad or miserable", options: ["Yes, most of the time", "Yes, quite often", "Not very often", "No, not at all"] },
        { id: 9, text: "I have been so unhappy that I have been crying", options: ["Yes, most of the time", "Yes, quite often", "Only occasionally", "No, never"] },
        { id: 10, text: "The thought of harming myself has occurred to me", options: ["Yes, quite often", "Sometimes", "Hardly ever", "Never"] }
    ];

    const symptomsQuestions = [
        { id: 1, category: "Mood", text: "Persistent sadness or low mood", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 2, category: "Mood", text: "Loss of interest or pleasure in activities", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 3, category: "Sleep", text: "Sleep disturbances (beyond normal infant care)", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 4, category: "Energy", text: "Fatigue or loss of energy", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 5, category: "Cognition", text: "Difficulty concentrating or making decisions", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 6, category: "Appetite", text: "Changes in appetite or weight", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 7, category: "Self-worth", text: "Feelings of worthlessness or guilt", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 8, category: "Anxiety", text: "Excessive worry or anxiety", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 9, category: "Bonding", text: "Difficulty bonding with baby", severity: ["Not at all", "Mild", "Moderate", "Severe"] },
        { id: 10, category: "Thoughts", text: "Intrusive negative thoughts", severity: ["Not at all", "Mild", "Moderate", "Severe"] }
    ];

    const calculateEPDSScore = (answers: Record<number, number>) => {
        const scoreMap: Record<number, number[]> = {
            1: [0, 1, 2, 3], 2: [0, 1, 2, 3], 3: [3, 2, 1, 0],
            4: [0, 1, 2, 3], 5: [3, 2, 1, 0], 6: [3, 2, 1, 0],
            7: [3, 2, 1, 0], 8: [3, 2, 1, 0], 9: [3, 2, 1, 0],
            10: [3, 2, 1, 0]
        };

        let total = 0;
        Object.keys(answers).forEach((key: string) => {
            const qId = parseInt(key);
            const answerIdx = answers[qId];
            total += scoreMap[qId][answerIdx];
        });
        return total;
    };

    const calculateSymptomsScore = (answers: Record<number, number>) => {
        let total = 0;
        Object.values(answers).forEach((val: number) => total += val);
        return total;
    };

    const getRiskLevel = (score: number, method: string) => {
        if (method === 'epds') {
            if (score >= 13) return { level: 'High', color: 'red', description: 'Likely experiencing postpartum depression' };
            if (score >= 10) return { level: 'Moderate', color: 'orange', description: 'Possible postpartum depression' };
            return { level: 'Low', color: 'green', description: 'Minimal depressive symptoms' };
        } else {
            if (score >= 25) return { level: 'High', color: 'red', description: 'Significant depressive symptoms present' };
            if (score >= 15) return { level: 'Moderate', color: 'orange', description: 'Moderate depressive symptoms' };
            return { level: 'Low', color: 'green', description: 'Minimal to mild symptoms' };
        }
    };

    const SelectMethodPage = () => (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3">Postpartum Depression Screening</h1>
                    <p className="text-gray-600">Choose your preferred screening method</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div
                        onClick={() => { setSelectedMethod('epds'); setCurrentPage('screening-layout'); }}
                        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <FileText className="text-blue-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">EPDS Method</h3>
                        <p className="text-gray-600 text-sm mb-4 text-center">Edinburgh Postnatal Depression Scale - Standard validated questionnaire</p>
                        <div className="flex items-center justify-center text-blue-600">
                            <span className="text-sm font-medium">Start EPDS</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div
                        onClick={() => { setSelectedMethod('symptoms'); setCurrentPage('screening-layout'); }}
                        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <AlertCircle className="text-purple-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Symptoms-Based</h3>
                        <p className="text-gray-600 text-sm mb-4 text-center">Evaluate specific symptoms with severity ratings</p>
                        <div className="flex items-center justify-center text-purple-600">
                            <span className="text-sm font-medium">Start Assessment</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>

                    <div
                        onClick={() => { setSelectedMethod('hybrid'); setCurrentPage('screening-layout'); }}
                        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <CheckCircle2 className="text-pink-600" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Hybrid Method</h3>
                        <p className="text-gray-600 text-sm mb-4 text-center">Combined approach for comprehensive analysis</p>
                        <div className="flex items-center justify-center text-pink-600">
                            <span className="text-sm font-medium">Start Hybrid</span>
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start">
                        <Info className="text-blue-600 mr-3 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">About This Screening</h4>
                            <p className="text-gray-600 text-sm">This screening tool is designed to help identify potential postpartum depression symptoms. It is not a diagnostic tool. Please consult with a healthcare professional for proper diagnosis and treatment.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ScreeningLayoutPage = () => (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => setCurrentPage('select-method')}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Methods
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {selectedMethod === 'epds' ? 'EPDS Screening' :
                            selectedMethod === 'symptoms' ? 'Symptoms-Based Screening' :
                                'Hybrid Screening'}
                    </h2>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            {selectedMethod === 'epds' ? 'Answer the following 10 questions based on how you have felt in the past 7 days.' :
                                selectedMethod === 'symptoms' ? 'Rate the severity of each symptom you have experienced in the past 2 weeks.' :
                                    'Complete both EPDS questions and symptom severity ratings for a comprehensive assessment.'}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => selectedMethod && setCurrentPage(selectedMethod)}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
                        >
                            Begin Screening
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const EPDSPage = () => {
        const handleAnswer = (questionId: number, optionIndex: number) => {
            setEpdsAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
        };

        const isComplete = Object.keys(epdsAnswers).length === 10;

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => setCurrentPage('screening-layout')}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Edinburgh Postnatal Depression Scale</h2>
                        <p className="text-gray-600 mb-6">Please select the answer that comes closest to how you have felt in the past 7 days</p>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-700">{Object.keys(epdsAnswers).length}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(Object.keys(epdsAnswers).length / 10) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {epdsQuestions.map(q => (
                                <div key={q.id} className="border-b pb-6">
                                    <p className="font-medium text-gray-800 mb-3">{q.id}. {q.text}</p>
                                    <div className="space-y-2">
                                        {q.options.map((option, idx) => (
                                            <label key={idx} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`q${q.id}`}
                                                    checked={epdsAnswers[q.id] === idx}
                                                    onChange={() => handleAnswer(q.id, idx)}
                                                    className="mr-3"
                                                />
                                                <span className="text-gray-700">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage('review')}
                            disabled={!isComplete}
                            className={`w-full mt-8 py-3 rounded-lg font-medium transition-all ${isComplete
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Review Answers
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const SymptomsPage = () => {
        const handleAnswer = (questionId: number, severityIndex: number) => {
            setSymptomsAnswers(prev => ({ ...prev, [questionId]: severityIndex }));
        };

        const isComplete = Object.keys(symptomsAnswers).length === 10;

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => setCurrentPage('screening-layout')}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Symptoms-Based Assessment</h2>
                        <p className="text-gray-600 mb-6">Rate the severity of each symptom over the past 2 weeks</p>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-700">{Object.keys(symptomsAnswers).length}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(Object.keys(symptomsAnswers).length / 10) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {symptomsQuestions.map(q => (
                                <div key={q.id} className="border-b pb-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <p className="font-medium text-gray-800">{q.text}</p>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{q.category}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {q.severity.map((level, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(q.id, idx)}
                                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${symptomsAnswers[q.id] === idx
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage('review')}
                            disabled={!isComplete}
                            className={`w-full mt-8 py-3 rounded-lg font-medium transition-all ${isComplete
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Review Answers
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const HybridPage = () => {
        const handleEPDSAnswer = (questionId: number, optionIndex: number) => {
            setHybridAnswers(prev => ({
                ...prev,
                epds: { ...prev.epds, [questionId]: optionIndex }
            }));
        };

        const handleSymptomsAnswer = (questionId: number, severityIndex: number) => {
            setHybridAnswers(prev => ({
                ...prev,
                symptoms: { ...prev.symptoms, [questionId]: severityIndex }
            }));
        };

        const isEPDSComplete = Object.keys(hybridAnswers.epds).length === 10;
        const isSymptomsComplete = Object.keys(hybridAnswers.symptoms).length === 10;

        if (hybridStep === 'epds') {
            return (
                <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => setCurrentPage('screening-layout')}
                            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Back
                        </button>

                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Hybrid Assessment - Part 1</h2>
                                    <p className="text-gray-600">EPDS Questions</p>
                                </div>
                                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">Step 1 of 2</span>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600">Progress</span>
                                    <span className="text-sm font-medium text-gray-700">{Object.keys(hybridAnswers.epds).length}/10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                                        style={{ width: `${(Object.keys(hybridAnswers.epds).length / 10) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {epdsQuestions.map(q => (
                                    <div key={q.id} className="border-b pb-6">
                                        <p className="font-medium text-gray-800 mb-3">{q.id}. {q.text}</p>
                                        <div className="space-y-2">
                                            {q.options.map((option, idx) => (
                                                <label key={idx} className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`hybrid_epds_q${q.id}`}
                                                        checked={hybridAnswers.epds[q.id] === idx}
                                                        onChange={() => handleEPDSAnswer(q.id, idx)}
                                                        className="mr-3"
                                                    />
                                                    <span className="text-gray-700">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setHybridStep('symptoms')}
                                disabled={!isEPDSComplete}
                                className={`w-full mt-8 py-3 rounded-lg font-medium transition-all ${isEPDSComplete
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Continue to Symptoms Assessment
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => setHybridStep('epds')}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to EPDS
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Hybrid Assessment - Part 2</h2>
                                <p className="text-gray-600">Symptoms Severity Rating</p>
                            </div>
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">Step 2 of 2</span>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-700">{Object.keys(hybridAnswers.symptoms).length}/10</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(Object.keys(hybridAnswers.symptoms).length / 10) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {symptomsQuestions.map(q => (
                                <div key={q.id} className="border-b pb-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <p className="font-medium text-gray-800">{q.text}</p>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{q.category}</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {q.severity.map((level, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSymptomsAnswer(q.id, idx)}
                                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${hybridAnswers.symptoms[q.id] === idx
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                    }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage('review')}
                            disabled={!isSymptomsComplete}
                            className={`w-full mt-8 py-3 rounded-lg font-medium transition-all ${isSymptomsComplete
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Review All Answers
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ReviewPage = () => {
        const getAnswersForReview = () => {
            if (selectedMethod === 'epds') return { epds: epdsAnswers };
            if (selectedMethod === 'symptoms') return { symptoms: symptomsAnswers };
            return hybridAnswers;
        };

        const answers = getAnswersForReview();

        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => selectedMethod && setCurrentPage(selectedMethod)}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Edit
                    </button>

                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Answers</h2>

                        {answers.epds && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">EPDS Responses</h3>
                                <div className="space-y-3">
                                    {epdsQuestions.map(q => (
                                        <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">{q.text}</p>
                                            <p className="font-medium text-gray-800">{q.options[answers.epds[q.id]]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {answers.symptoms && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Symptom Ratings</h3>
                                <div className="space-y-3">
                                    {symptomsQuestions.map(q => (
                                        <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">{q.text}</p>
                                            <p className="font-medium text-gray-800">{q.severity[answers.symptoms[q.id]]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setCurrentPage('result')}
                            className="w-full mt-8 py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all"
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render the appropriate page based on currentPage state
    const renderPage = () => {
        switch (currentPage) {
            case 'select-method':
                return <SelectMethodPage />;
            case 'screening-layout':
                return <ScreeningLayoutPage />;
            case 'epds':
                return <EPDSPage />;
            case 'symptoms':
                return <SymptomsPage />;
            case 'hybrid':
                return <HybridPage />;
            case 'review':
                return <ReviewPage />;
            default:
                return <SelectMethodPage />;
        }
    };

    return renderPage();
};

export default PPDScreeningApp;