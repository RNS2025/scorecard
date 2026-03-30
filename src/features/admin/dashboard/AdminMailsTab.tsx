import { useState } from "react";
import {
    EnvelopeIcon,
    UserGroupIcon,
    ClipboardDocumentIcon,
    CheckIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { useAdminMarketingEmails } from "../../../hooks/useAdmin.ts";

const AdminMailsTab = () => {
    const { data: marketingEmails, isLoading } = useAdminMarketingEmails();
    const [copied, setCopied] = useState(false);

    const handleCopyEmails = () => {
        if (!marketingEmails) return;
        const text = marketingEmails.map(e => e.email).join("\n");
        navigator.clipboard.writeText(text).then();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportCSV = () => {
        if (!marketingEmails) return;
        const header = "Navn,Email,Dato\n";
        const rows = marketingEmails.map(e =>
            `"${e.playerName}","${e.email}","${e.createdAt ? format(new Date(e.createdAt), "dd/MM/yyyy") : "—"}"`
        ).join("\n");
        const blob = new Blob([header + rows], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mailliste-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                    Marketing-samtykke
                    {marketingEmails && (
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({marketingEmails.length})
                        </span>
                    )}
                </h2>
                {marketingEmails && marketingEmails.length > 0 && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyEmails}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                        >
                            {copied
                                ? <><CheckIcon className="w-4 h-4 text-green-600" /> Kopieret!</>
                                : <><ClipboardDocumentIcon className="w-4 h-4" /> Kopiér</>
                            }
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="px-3 py-1.5 bg-green-700 text-white hover:bg-green-800 rounded-lg text-sm font-medium transition"
                        >
                            Eksportér CSV
                        </button>
                    </div>
                )}
            </div>

            {isLoading && <p className="text-center animate-pulse text-gray-400">Henter mailliste...</p>}

            {!isLoading && (!marketingEmails || marketingEmails.length === 0) && (
                <div className="text-center mt-10">
                    <EnvelopeIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Ingen har givet marketing-samtykke endnu</p>
                </div>
            )}

            {!isLoading && marketingEmails && marketingEmails.length > 0 && (
                <div className="flex flex-col gap-2">
                    {marketingEmails.map((entry, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white border rounded-xl p-4">
                            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                                <UserGroupIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{entry.playerName}</p>
                                <p className="text-sm text-gray-400 truncate">{entry.email}</p>
                            </div>
                            <p className="text-xs text-gray-300 whitespace-nowrap">
                                {entry.createdAt
                                    ? format(new Date(entry.createdAt), "d. MMM", { locale: da })
                                    : ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMailsTab;

