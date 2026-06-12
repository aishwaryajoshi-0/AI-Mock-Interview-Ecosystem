import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Briefcase, Search } from "lucide-react";
import Button from "../ui/Button";
import CompanyProfileCard from "./CompanyProfileCard";
import * as companyService from "../../services/companyService";

const CompanySelector = ({ onConfirm }) => {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [company, setCompany] = useState(null);
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    companyService.getAllCompanies().then(setCompanies).catch(() => setCompanies([]));
  }, []);

  const filtered = useMemo(
    () => companies.filter((name) => name.toLowerCase().includes(query.toLowerCase())),
    [companies, query]
  );

  const selectCompany = async (name) => {
    setCompany(name);
    setStep(2);
    const nextRoles = await companyService.getCompanyRoles(name);
    setRoles(nextRoles);
    setRole(nextRoles[0] || "");
    if (nextRoles[0]) {
      setProfile(await companyService.getCompanyProfile(name, nextRoles[0]));
    }
  };

  const selectRole = async (nextRole) => {
    setRole(nextRole);
    setProfile(await companyService.getCompanyProfile(company, nextRole));
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="companies" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input className="w-full outline-none" placeholder="Search company" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {filtered.map((name) => (
                <button key={name} onClick={() => selectCompany(name)} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 text-left hover:border-brand-300">
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 font-semibold text-brand-700">{name.slice(0, 2).toUpperCase()}</span>
                    <span className="font-semibold text-slate-900">{name}</span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">roles</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="roles" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600" onClick={() => setStep(1)}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-3">
              <Briefcase className="text-brand-600" />
              <h2 className="text-xl font-semibold text-slate-900">{company}</h2>
            </div>
            <select className="w-full rounded-lg border border-slate-200 px-4 py-3" value={role} onChange={(event) => selectRole(event.target.value)}>
              {roles.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <CompanyProfileCard profile={profile} />
            <Button disabled={!profile} onClick={() => onConfirm(company, role, profile)}>Start Interview with this Profile</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanySelector;
