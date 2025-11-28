
import React from 'react';
import { MathBlock, Sup, Sub } from '../components/MathBlock';
import { AlertTriangle, ArrowDown, Megaphone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SectionTitle = ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-yellow-500 mt-16 mb-6 border-l-4 border-yellow-500 pl-4">
        {children}
    </h2>
);

const SpecTable = ({ title, items }: { title: string, items: { label: string, value: string }[] }) => (
    <div className="mb-8 bg-neutral-900 p-4 rounded border border-neutral-800">
        <h3 className="font-bold text-white mb-3 pb-2 border-b border-neutral-800 flex justify-between items-center">
            {title}
        </h3>
        <table className="w-full text-sm">
            <tbody>
                {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-neutral-800/50 last:border-0">
                        <th className="text-left py-2 text-neutral-500 font-normal w-1/3">{item.label}</th>
                        <td className="py-2 text-neutral-300">{item.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const TheoryPage = () => {
    return (
        <div className="animate-in fade-in duration-700">
            <div className="mb-12">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                    PROJECT: <span className="text-red-600">MOVING TMU</span>
                </h1>
                <p className="text-neutral-500 text-sm font-mono uppercase tracking-widest">
                    Ver.3.3 // 理論物理学部門
                </p>
                <div className="w-24 h-1 bg-red-600 mt-6"></div>
            </div>

            <div className="bg-neutral-900/50 border-l-4 border-red-600 p-6 sm:p-8 rounded-r-lg mb-12 shadow-2xl shadow-black/50">
                <h2 className="text-xl font-bold text-white mb-4">0. 概要：Metropolitanへの物理的回帰</h2>
                <div className="space-y-4 text-neutral-300 leading-relaxed">
                    <p>
                        "Tokyo Metropolitan University" —— その高潔な響きは、コンクリートジャングルの摩天楼、知の最前線、すなわち<strong className="text-white">「首都の心臓部」</strong>にこそ相応しい。
                    </p>
                    <p>
                        しかし、我々を取り巻く現実はあまりに残酷だ。南大沢の終わりなき緑とタヌキの影、日野の無機質な工業団地、荒川の牧歌的な下町情緒。
                        これらは確かに美しいが、"Metropolitan"（大都市の、首都の）という定義とは、数万光年の隔たりがある。
                    </p>
                    <p>
                        多摩丘陵の彼方から、我々は常に東の空を見上げてきた。煌めく丸の内のビル群、東京駅の赤煉瓦。
                        あそここそが、我々の魂が帰るべき場所（プロミスト・ランド）。行政の決定を待つ時間はもうない。
                    </p>
                    <p className="font-medium text-white">
                        我々に必要なのは、圧倒的な<span className="text-red-500">物理的推力 (Physical Force)</span> のみ。
                    </p>
                </div>
                
                <div className="mt-6 text-xl font-bold text-yellow-500 bg-yellow-500/10 p-4 rounded border border-yellow-500/20">
                    <p>
                        すなわち、全キャンパスを物理的に押し、大地を滑らせ、真のMetropolitan（丸の内）まで強制移動させることである。
                        これは単なる引越しではない。地理的矛盾（Geographical Paradox）に対する、物理学を駆使した叛逆である。
                    </p>
                </div>
            </div>

            <p className="text-neutral-300 leading-relaxed">
                本プロジェクトは、東京都立大学の3キャンパス（南大沢・日野・荒川）に存在する
                <strong className="text-white"> 全建造物 51棟 </strong>
                を、物理的な「推力」によって千代田区丸の内（東京駅）へ一括輸送する計画である。
            </p>

            <SectionTitle>1. 輸送対象の定義 (Target Mass)</SectionTitle>
            
            <div className="grid md:grid-cols-2 gap-4">
                <SpecTable 
                    title="🏢 南大沢キャンパス" 
                    items={[
                        { label: "主要施設", value: "1〜12号館, 91年館, 本部棟" },
                        { label: "研究・厚生", value: "フロンティア棟, 図書館, 講堂" },
                        { label: "小計", value: "37 棟" }
                    ]}
                />
                <div className="space-y-4">
                    <SpecTable 
                        title="🏭 日野キャンパス" 
                        items={[
                            { label: "施設内訳", value: "1〜6号館, 大学会館" },
                            { label: "小計", value: "8 棟" }
                        ]}
                    />
                    <SpecTable 
                        title="🏥 荒川キャンパス" 
                        items={[
                            { label: "施設内訳", value: "校舎, 図書館, 厚生棟" },
                            { label: "小計", value: "6 棟" }
                        ]}
                    />
                </div>
            </div>

            <div className="bg-neutral-800 border border-neutral-700 p-4 rounded text-center mb-8">
                <span className="text-neutral-400 text-sm uppercase tracking-widest">Grand Total Mass (総質量)</span>
                <div className="text-3xl font-black text-white mt-2">
                    1.02 × 10<sup className="text-lg">9</sup> kg
                </div>
                <div className="text-red-500 font-bold text-sm mt-1">(102万トン)</div>
            </div>

            <SectionTitle>2. 運動方程式による試算</SectionTitle>
            <p className="text-neutral-300 mb-4">
                学生1人が全力 (<span className="font-mono text-yellow-500">F = 500 N</span>) で推力を供給した場合の加速度 <span className="font-mono text-white">a</span> を算出する。
            </p>

            <MathBlock label="式 1: 加速度の導出">
                a = <span className="mx-2">500</span> / <span className="mx-2">(1.02 × 10<Sup>9</Sup>)</span> ≈ 4.90 × 10<Sup>-7</Sup> [m/s<Sup>2</Sup>]
            </MathBlock>

            <p className="text-neutral-300 mb-4">
                1回のプッシュ（10秒間持続）で進む距離 <span className="font-mono text-white">x</span> (摩擦係数 <span className="font-mono">μ=0</span> の理想環境下):
            </p>

            <MathBlock label="式 2: 1プッシュあたりの変位">
                x = ½ a t<Sup>2</Sup> ≈ 0.0000245 m = <span className="text-red-500 font-bold">0.0245 mm</span>
            </MathBlock>

            <SectionTitle>3. 結論：卒業へのタイムリミット</SectionTitle>
            
            <MathBlock label="式 3: 必要総プッシュ数">
                N = 45,000 / 0.0000245 ≈ <span className="text-white font-bold">18.4億回</span>
            </MathBlock>

            <p className="text-neutral-300 mb-8">
                全学学生数 約9,000人が結束し、<strong className="text-white">1人1日10回</strong>、
                渾身の力でキャンパスを押した（推力を供給した）と仮定する。
                (1日の総推力 = 9万回分)
            </p>

            <div className="relative overflow-hidden rounded-xl border-2 border-red-600 bg-red-900/10 p-8 text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
                <h3 className="text-neutral-400 text-sm uppercase tracking-widest mb-4">Estimated Time of Arrival (到着予定)</h3>
                <div className="text-5xl sm:text-6xl font-black text-red-500 mb-2">
                    20,444 <span className="text-2xl text-red-400 font-normal">日</span>
                </div>
                <div className="text-xl text-white font-bold">
                    (約 56.0 年)
                </div>
            </div>

            <div className="mt-12 p-6 bg-neutral-900 rounded-lg border border-red-900/50 flex gap-4 items-start">
                <div className="bg-red-900/20 p-3 rounded-full shrink-0">
                     <Megaphone className="text-red-500" size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg mb-2">未来への遺産 (Legacy for the Future)</h4>
                    <p className="text-neutral-300 leading-relaxed">
                        56年という歳月は、我々が現役のうちに丸の内の土を踏むことが事実上不可能であることを示している。
                        だが、それが何だというのだ？
                        <br className="hidden sm:block" />
                        我々の汗と推力は、確実にキャンパスを東の都へと進めている。
                        今日君が稼ぐ数ミリが、<span className="text-white font-bold">君の孫の代</span>が通う「都立大丸の内キャンパス」の礎となるのだ。
                        未来のために、今、押せ。
                    </p>
                </div>
            </div>

            <div className="flex justify-center mt-16 mb-8">
                <ArrowDown className="text-neutral-700 animate-bounce" size={32} />
            </div>

             {/* CTA Button to Operation */}
             <div className="flex justify-center pb-12">
                <Link to="/operation" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-red-600 font-mono rounded-lg hover:bg-red-700 hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)]">
                    <span className="mr-2">理論確認完了：作戦開始</span>
                    <ChevronRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default TheoryPage;
