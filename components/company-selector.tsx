'use client';

import { useEffect, useState, useTransition } from 'react';
import { Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setSelectedCompanyId } from '@/lib/company-context';
import { useRouter } from 'next/navigation';
import { useCompanyTransition } from '@/lib/company-transition-context';

interface Company {
  id: number;
  name: string;
  slug: string;
}

interface CompanySelectorProps {
  initialCompanyId: number;
}

export function CompanySelector({ initialCompanyId }: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState<string>(initialCompanyId.toString());
  const [isPending, startTransition] = useTransition();
  const { setIsPending } = useCompanyTransition();
  const router = useRouter();

  // Fetch companies on mount
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch('/api/companies');
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
      }
    }

    fetchCompanies();
  }, []);

  const handleCompanyChange = (newCompanyId: string) => {
    setSelectedId(newCompanyId);
    setIsPending(true);

    startTransition(async () => {
      try {
        await setSelectedCompanyId(parseInt(newCompanyId, 10));
        router.refresh();
      } catch (error) {
        console.error('Failed to update company:', error);
        // Revert selection on error
        setSelectedId(initialCompanyId.toString());
      } finally {
        setIsPending(false);
      }
    });
  };

  const selectedCompany = companies.find((c) => c.id.toString() === selectedId);

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedId}
        onValueChange={handleCompanyChange}
        disabled={isPending || companies.length === 0}
      >
        <SelectTrigger className="w-[200px] h-9">
          <SelectValue>
            {selectedCompany?.name || 'Select company...'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id.toString()}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
