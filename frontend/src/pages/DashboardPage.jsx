import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getLanguageStyle } from '../constants/languages';
import { useToast } from '../hooks/useToast';
import Card from '../components/Card';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { CardSkeleton, TableRowSkeleton } from '../components/Skeleton';
import {
  Search,
  Filter,
  Check,
  X,
  Database,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  FileText,
  Lock,
  Mail,
  Key
} from 'lucide-react';

export const DashboardPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Admin Authentication State
  const [token, setToken] = useState(localStorage.getItem('vitto_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Local state for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await applicationApi.login(email, password);
      localStorage.setItem('vitto_admin_token', response.data.token);
      setToken(response.data.token);
      toast('Authenticated successfully as Admin', 'success');
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const autoFillCredentials = () => {
    setEmail('admin@example.com');
    setPassword('admin@vitto');
    toast('Credentials auto-filled!', 'info');
  };

  // Fetch applications list query (only if logged in)
  const { 
    data: applicationsResponse, 
    isLoading: isAppsLoading,
    isError: isAppsError 
  } = useQuery({
    queryKey: ['applications', statusFilter],
    queryFn: () => applicationApi.getAll(statusFilter),
    enabled: !!token,
  });

  // Fetch metrics summary query (only if logged in)
  const { 
    data: summaryResponse, 
    isLoading: isSummaryLoading 
  } = useQuery({
    queryKey: ['summary'],
    queryFn: () => applicationApi.getSummary(),
    enabled: !!token,
  });

  // PATCH status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => applicationApi.updateStatus(id, status),
    onSuccess: (response, variables) => {
      // Invalidate both cache entries for live update
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      
      toast(`Application reference ${response.data.applicationReference} has been ${variables.status}.`, 'success');
    },
    onError: (err) => {
      const errorMsg = err.message || 'Failed to update application status.';
      toast(errorMsg, 'error');
    },
  });

  const handleStatusChange = (id, status) => {
    statusMutation.mutate({ id, status });
  };

  const applicationsList = applicationsResponse?.data || [];
  const metrics = summaryResponse?.data || {
    totalApplications: 0,
    totalLoanAmount: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  };

  // Instant client-side search filtering (search matches against name or mobile)
  const filteredApplications = applicationsList.filter((app) => {
    const nameMatch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const mobileMatch = app.mobile.includes(searchQuery);
    return nameMatch || mobileMatch;
  });

  // If not logged in, show the login panel
  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:py-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-premium ring-1 ring-slate-100/50 animate-slide-up">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand-primary mb-6 shadow-sm shadow-blue-100">
            <Lock className="h-6 w-6 text-brand-primary" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-1">
            Operations Portal
          </h2>
          <p className="text-xs text-slate-500 text-center mb-6">
            Secure sign-in for Vitto underwriting officers
          </p>

          {/* Quick Access Credentials Alert Box */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4.5 mb-6 text-xs text-slate-700 leading-relaxed shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1.5">
              <Key className="h-3.5 w-3.5 text-brand-primary" />
              <span>Evaluator Access Credentials</span>
            </div>
            <div className="space-y-1 text-slate-600 font-medium">
              <div>Email: <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800 select-all">admin@example.com</code></div>
              <div>Secret Key: <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-[11px] text-slate-800 select-all">admin@vitto</code></div>
              <div className="text-[10px] text-slate-400 mt-1.5 italic font-semibold">Note: Provided for evaluation and testing purposes.</div>
            </div>
            <button
              type="button"
              onClick={autoFillCredentials}
              className="mt-3 inline-flex items-center justify-center font-bold text-brand-primary hover:text-blue-700 transition-colors bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-sm text-[11px] cursor-pointer"
            >
              Autofill Credentials
            </button>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-brand-danger text-xs rounded-xl p-3 mb-6 font-medium animate-fade-in">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-brand-primary outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Secret Key
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-brand-primary outline-none transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 hover:bg-blue-700 active:scale-98 transition-all duration-150 disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Operations Hub
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Track underwriting metrics, review applicant documents, and manage instant approvals.
          </p>
        </div>
        
        {/* Sign Out Button */}
        <button
          onClick={() => {
            localStorage.removeItem('vitto_admin_token');
            setToken(null);
            toast('Logged out successfully', 'info');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-red-200 hover:bg-red-50/70 hover:text-brand-danger text-slate-700 text-sm font-semibold rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-max cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* METRICS PANEL SECTION */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {isSummaryLoading ? (
          Array.from({ length: 5 }).map((_, idx) => <CardSkeleton key={idx} />)
        ) : (
          <>
            {/* Card 1: Total Applications */}
            <Card hoverEffect className="flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Apps</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Database className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.totalApplications}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Registered database logs</p>
              </div>
            </Card>

            {/* Card 2: Total Loan Amount */}
            <Card hoverEffect className="flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Requested Volume</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand-primary">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formatCurrency(metrics.totalLoanAmount)}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Accumulated principal</p>
              </div>
            </Card>

            {/* Card 3: Approved */}
            <Card hoverEffect className="flex flex-col justify-between border-l-4 border-l-brand-success">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Approved</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-brand-success">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.approvedCount}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Underwritten approvals</p>
              </div>
            </Card>

            {/* Card 4: Pending */}
            <Card hoverEffect className="flex flex-col justify-between border-l-4 border-l-brand-warning">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-brand-warning">
                  <Clock className="h-4.5 w-4.5 animate-pulse-subtle" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.pendingCount}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Awaiting risk review</p>
              </div>
            </Card>

            {/* Card 5: Rejected */}
            <Card hoverEffect className="flex flex-col justify-between border-l-4 border-l-brand-danger">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Rejected</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-brand-danger">
                  <XCircle className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.rejectedCount}</div>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Declined requests</p>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm mb-6">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search by applicant name or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-brand-primary outline-none transition-all duration-200"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-40 px-3 py-2 text-sm bg-white rounded-xl border border-slate-200 outline-none hover:border-slate-300 focus:border-brand-primary transition-colors cursor-pointer"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* APPLICATIONS DATA SHEET */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-400">
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Reference / Date</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-right">Loan Amount</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Language</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isAppsLoading ? (
                Array.from({ length: 6 }).map((_, idx) => <TableRowSkeleton key={idx} />)
              ) : isAppsError ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-rose-500 font-semibold">
                    Error loading database logs. Check connection configuration.
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4">
                    <EmptyState 
                      isSearch={searchQuery !== ''} 
                      title={searchQuery !== '' ? 'No matching records' : 'No applications logged'}
                      description={searchQuery !== '' 
                        ? `We couldn't find any loans associated with name or phone matching "${searchQuery}".` 
                        : 'No borrower requests are registered under this status.'
                      }
                    />
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr 
                    key={app.id} 
                    className="hover:bg-slate-50/40 transition-colors animate-fade-in group"
                  >
                    {/* Reference & Date */}
                    <td className="px-6 py-4 text-xs font-semibold leading-relaxed">
                      <div className="font-mono text-slate-800 text-sm tracking-tight select-all">{app.applicationReference}</div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{formatDate(app.createdAt)}</div>
                    </td>

                    {/* Applicant Name */}
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm whitespace-nowrap">
                      {app.name}
                    </td>

                    {/* Mobile */}
                    <td className="px-6 py-4 font-mono text-slate-600 text-sm whitespace-nowrap">
                      {app.mobile}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right font-extrabold text-slate-900 text-sm whitespace-nowrap">
                      {formatCurrency(app.amount)}
                    </td>

                    {/* Purpose */}
                    <td className="px-6 py-4 max-w-xs text-xs text-slate-500 leading-normal truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                      {app.purpose}
                    </td>

                    {/* Language */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="custom" className={`${getLanguageStyle(app.language)} font-bold tracking-tight text-[10px]`}>
                        {app.language}
                      </Badge>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={app.status.toLowerCase()} className="text-[10px] tracking-wider font-extrabold">
                        {app.status}
                      </Badge>
                    </td>

                    {/* Action buttons (Approve / Reject) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {app.status === 'pending' ? (
                        <div className="inline-flex gap-1.5 justify-center">
                          {/* Approve Button */}
                          <button
                            onClick={() => handleStatusChange(app.id, 'approved')}
                            disabled={statusMutation.isPending}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-brand-success hover:bg-brand-success hover:text-white border border-emerald-100 transition-all duration-150 disabled:opacity-50"
                            title="Approve Application"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          
                          {/* Reject Button */}
                          <button
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            disabled={statusMutation.isPending}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-brand-danger hover:bg-brand-danger hover:text-white border border-rose-100 transition-all duration-150 disabled:opacity-50"
                            title="Reject Application"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest cursor-default select-none">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
