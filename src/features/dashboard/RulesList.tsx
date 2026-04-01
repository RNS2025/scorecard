interface RulesListProps {
    rules: string[];
}

const RulesList = ({ rules }: RulesListProps) => {
    if (rules.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white/5 rounded-2xl">
                <p className="text-white/30">Ingen regler tilgængelige</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
            {rules.map((rule, i) => (
                <div
                    key={i}
                    className="flex-1 flex gap-3 items-center bg-white/5 rounded-xl px-5"
                    style={{ minHeight: `${100 / rules.length}%` }}
                >
                    <span className="shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                    </span>
                    <p className="text-white/80 leading-relaxed">{rule}</p>
                </div>
            ))}
        </div>
    );
};

export default RulesList;

