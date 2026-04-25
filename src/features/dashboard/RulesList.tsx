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
        <div className={`h-full bg-white/5 rounded-xl grid grid-rows-${rules.length} gap-5 py-2 overflow-y-auto pr-2`}>
            {rules.map((rule, i) => (
                <div
                    key={i}
                    className="flex gap-4 items-center px-5"
                >
                    <span className="shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">
                        {i + 1}
                    </span>
                    <p className="text-white/80 leading-relaxed text-lg">{rule}</p>
                </div>
            ))}
        </div>
    );
};

export default RulesList;

