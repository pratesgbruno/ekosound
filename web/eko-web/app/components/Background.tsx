export default function Background() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none sticky top-0 z-0 bg-[#f4f6f0]">
            <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[50%] bg-[#dbece5] rounded-full blur-[100px] opacity-70 mix-blend-multiply animate-blob"></div>
            <div className="absolute top-[30%] -right-[10%] w-[70%] h-[50%] bg-[#e8e4d9] rounded-full blur-[100px] opacity-70 mix-blend-multiply animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-[10%] left-[10%] w-[60%] h-[40%] bg-[#d9e6e8] rounded-full blur-[100px] opacity-70 mix-blend-multiply animate-blob animation-delay-4000"></div>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
        </div>
    );
}
