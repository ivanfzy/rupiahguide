const Footer = () => {
  return (
    <footer className="bg-stone-800 text-stone-400 py-6 mt-20 text-center text-sm">
      <div className="max-w-4xl mx-auto px-6">
        <p className="font-semibold text-stone-200 mb-2">RupiahGuide</p>
        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        <p className="text-xs mt-4 opacity-60 max-w-md mx-auto leading-relaxed">
          Exchange rates are approximate estimates provided by AI for informational purposes only. 
          Please verify with official money changers or banks before transactions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
