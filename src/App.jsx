import React, { useState, useMemo } from 'react';
import { Calculator, ClipboardList, TrendingUp, Calendar, Clock, DollarSign, Plus, Trash2, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RATES, calculateWeeklyCost, calculateTotalPlanCost, calculateHoursFromBudget } from './utils/calculationUtils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function App() {
  const [mode, setMode] = useState('have-plan'); // 'have-plan' or 'need-quote'
  const [budget, setBudget] = useState(50000);
  const [selectedRateType, setSelectedRateType] = useState('WEEKDAY_DAY');
  const [shifts, setShifts] = useState([
    { id: 1, rateType: 'WEEKDAY_DAY', hours: 4, days: ['Mon', 'Wed', 'Fri'], recurrence: 'WEEKLY' }
  ]);

  // Derived Values
  const totalWeeklyCost = useMemo(() => {
    return shifts.reduce((total, shift) => {
      const rate = RATES[shift.rateType] || RATES.WEEKDAY_DAY;
      const numDays = shift.days.length || 1;
      return total + (rate * shift.hours * numDays);
    }, 0);
  }, [shifts]);

  const totalYearlyCost = calculateTotalPlanCost(totalWeeklyCost);
  const hoursPerWeekFromBudget = calculateHoursFromBudget(budget, selectedRateType);

  const addShift = () => {
    setShifts([{ id: Date.now(), rateType: 'WEEKDAY_DAY', hours: 2, days: ['Mon'], recurrence: 'WEEKLY' }, ...shifts]);
  };

  const removeShift = (id) => {
    setShifts(shifts.filter(s => s.id !== id));
  };

  const updateShift = (id, field, value) => {
    setShifts(shifts.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleDay = (shiftId, day) => {
    const shift = shifts.find(s => s.id === shiftId);
    const newDays = shift.days.includes(day)
      ? shift.days.filter(d => d !== day)
      : [...shift.days, day];
    updateShift(shiftId, 'days', newDays);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center bg-[#f8fafc]">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-carevia-blue rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-carevia-blue/20 rotate-3">
            <Calculator className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-4xl tracking-tight text-carevia-blue mb-1">Carevia</h1>
            <p className="text-[11px] text-carevia-purple font-bold uppercase tracking-[0.25em]">Empowered Living Support Services</p>
          </div>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
          <span className="hover:text-carevia-blue cursor-pointer transition-colors">Pricing Guide</span>
          <span className="hover:text-carevia-blue cursor-pointer transition-colors">Support FAQs</span>
        </div>
      </header>

      <main className="w-full max-w-6xl">
        {/* Mode Switcher */}
        <div className="flex p-2 bg-gray-200/40 backdrop-blur-sm rounded-[2rem] mb-16 w-fit mx-auto border border-white/60 shadow-inner">
          <button
            onClick={() => setMode('have-plan')}
            className={`px-10 py-4 rounded-[1.5rem] text-base font-bold transition-all flex items-center gap-3 ${mode === 'have-plan' ? 'bg-white text-carevia-blue shadow-xl scale-105' : 'text-gray-500 hover:text-carevia-blue hover:bg-white/50'}`}
          >
            <TrendingUp className="w-5 h-5" />
            Plan Analysis
          </button>
          <button
            onClick={() => setMode('need-quote')}
            className={`px-10 py-4 rounded-[1.5rem] text-base font-bold transition-all flex items-center gap-3 ${mode === 'need-quote' ? 'bg-white text-carevia-blue shadow-xl scale-105' : 'text-gray-500 hover:text-carevia-blue hover:bg-white/50'}`}
          >
            <ClipboardList className="w-5 h-5" />
            Quote Builder
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Section */}
          <div className="lg:col-span-7 space-y-10">
            <AnimatePresence mode="wait">
              {mode === 'have-plan' ? (
                <motion.div
                  key="have-plan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-12 rounded-[3rem]"
                >
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-50 text-carevia-blue rounded-xl">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl">How much funding do you have?</h2>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Annual Support Budget</label>
                      <div className="relative group">
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-carevia-blue/30 group-focus-within:text-carevia-blue transition-colors text-4xl font-light">$</div>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full pl-16 pr-10 py-10 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-carevia-blue/20 focus:bg-white focus:ring-0 text-6xl font-black text-gray-800 transition-all placeholder:text-gray-200"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100">
                      <label className="block text-xs font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">Preferred Service Type</label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(RATES).map(([key, rate]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedRateType(key)}
                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 group ${selectedRateType === key ? 'border-carevia-blue bg-blue-50/50 text-carevia-blue shadow-lg' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:scale-[1.02]'}`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest text-center opacity-70 leading-tight">
                              {key.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-xl font-black ${selectedRateType === key ? 'text-carevia-blue' : 'text-gray-800'}`}>${rate}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 bg-blue-50/40 rounded-[2rem] border border-blue-100 inline-flex items-start gap-5">
                      <Info className="w-6 h-6 text-carevia-blue mt-1 shrink-0" />
                      <p className="text-base text-gray-600 leading-relaxed">
                        This budget represents your <strong>Core Supports</strong>. We've matched it against the latest <strong>NDIS 2024/25 Price Guide</strong> to give you accurate hour estimates.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="need-quote"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-12 rounded-[3rem]"
                >
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-50 text-carevia-purple rounded-xl">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <h2 className="text-3xl">Build your support schedule</h2>
                    </div>
                    <button
                      onClick={addShift}
                      className="px-6 py-3 bg-carevia-blue text-white rounded-2xl font-black text-sm shadow-xl shadow-carevia-blue/20 flex items-center gap-3 hover:bg-carevia-blue/90 transition-all hover:scale-105 active:scale-95"
                    >
                      <Plus className="w-5 h-5" /> Add Item
                    </button>
                  </div>

                  <div className="space-y-8">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="p-10 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50">
                        <div className="space-y-8">
                          {/* Row 1: Rate & Hours */}
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4 block">Service Timing</label>
                              <select
                                value={shift.rateType}
                                onChange={(e) => updateShift(shift.id, 'rateType', e.target.value)}
                                className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 px-6 text-base font-bold focus:border-carevia-blue outline-none transition-colors cursor-pointer"
                              >
                                {Object.keys(RATES).map(rate => (
                                  <option key={rate} value={rate}>{rate.replace(/_/g, ' ')}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4 block">Hours per Day</label>
                              <div className="flex items-center gap-4 bg-white border-2 border-gray-100 rounded-2xl py-2 px-6">
                                <Clock className="w-5 h-5 text-carevia-blue" />
                                <input
                                  type="number"
                                  value={shift.hours}
                                  step="0.5"
                                  onChange={(e) => updateShift(shift.id, 'hours', Number(e.target.value))}
                                  className="w-full py-2 bg-transparent border-none focus:ring-0 font-black text-2xl"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Row 2: Days */}
                          <div>
                            <label className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4 block">Support Days</label>
                            <div className="flex flex-wrap gap-3">
                              {DAYS.map(day => (
                                <button
                                  key={day}
                                  onClick={() => toggleDay(shift.id, day)}
                                  className={`px-6 py-3.5 rounded-2xl text-sm font-black transition-all ${shift.days.includes(day) ? 'bg-carevia-blue text-white shadow-xl scale-105' : 'bg-white text-gray-400 border-2 border-gray-100 hover:border-gray-300'}`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeShift(shift.id)}
                          className="absolute top-6 right-6 text-gray-200 hover:text-red-500 p-3 transition-colors rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-8">
              <div className="p-12 rounded-[3.5rem] bg-carevia-blue text-white overflow-hidden relative shadow-2xl shadow-carevia-blue/30 border-4 border-white">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-carevia-green/30 rounded-full blur-[90px] pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-12 flex items-center gap-4">
                    <div className="p-2 bg-carevia-green rounded-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    Support Summary
                  </h3>

                  <div className="space-y-12">
                    {mode === 'have-plan' ? (
                      <div>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-8xl font-black tracking-tighter tabular-nums">{hoursPerWeekFromBudget.toFixed(1)}</span>
                          <span className="text-blue-100 font-black uppercase tracking-[0.2em] text-sm">Hours / Week</span>
                        </div>
                        <div className="mt-12 p-8 bg-white/10 backdrop-blur-sm rounded-[2.5rem] space-y-6 border border-white/10">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100 font-bold uppercase tracking-widest text-xs">Monthly Est.</span>
                            <span className="text-2xl font-black">{(hoursPerWeekFromBudget * 4.33).toFixed(1)} <span className="text-sm font-bold opacity-60">Hrs</span></span>
                          </div>
                          <div className="flex justify-between items-center pt-6 border-t border-white/10">
                            <span className="text-blue-100 font-bold uppercase tracking-widest text-xs">Fortnightly</span>
                            <span className="text-2xl font-black">{(hoursPerWeekFromBudget * 2).toFixed(1)} <span className="text-sm font-bold opacity-60">Hrs</span></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-10">
                          <div className="text-7xl font-black tracking-tighter tabular-nums mb-3">
                            ${totalWeeklyCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </div>
                          <div className="text-blue-100 text-sm font-black uppercase tracking-[0.25em]">Estimated Weekly Cost</div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                            <div className="text-xs font-black uppercase tracking-widest text-blue-100">Monthly Support</div>
                            <div className="font-black text-2xl tabular-nums">${(totalWeeklyCost * 4.33).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          </div>
                          <div className="flex justify-between items-center bg-carevia-green p-8 rounded-[2.5rem] shadow-2xl shadow-carevia-green/20 border-2 border-white/20">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-white/90">Required Annual Plan</div>
                            <div className="font-black text-4xl tabular-nums">${totalYearlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 pt-4">
                      <button className="w-full bg-white text-carevia-blue py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 group hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-900/50">
                        Discuss this Quote
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button className="w-full py-4 text-blue-100 font-black text-sm uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2">
                        Download Breakdown PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-8 rounded-[2.5rem] bg-white border-2 border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-carevia-green shrink-0 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-sm text-gray-500 font-bold leading-relaxed">
                  Carevia is a registered NDIS provider. This tool provides estimates based on current price guide limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 text-gray-400 text-xs py-12 border-t border-gray-200 w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-bold">© {new Date().getFullYear()} Carevia Support Services PTY LTD</div>
        <div className="flex gap-10 uppercase tracking-[0.2em] font-black">
          <a href="#" className="hover:text-carevia-blue transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-carevia-blue transition-colors">Terms of Use</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
