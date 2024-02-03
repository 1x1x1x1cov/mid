const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
mongoose.connect('mongodb://localhost:27017/crying');

const InfoSchema = new mongoose.Schema({
    HovaTen: String,
    NgaySinh: Date,
    NoiSinh: String,
    QuocTich: String,
    QuaTrinhHocVan: String,

    LamViec: [
      {
        KiNang: [String],
        DuAn: [
          {
            Ten: String,
            NoiDung: String,
            VaiTro: String,
            BatDau: Date,
            KetThuc: Date,
          },
        ],
        ThoiGianLamViec: [
          {
            BatDau: Date,
            KetThuc: { type: Date, default: null },
            CongTy: String,
            VaiTro: String,
          },
        ],
      },
    ],
    ThongTinBoSung: {
      SoThich: [String],
      MucTieu: [String],
    },
  });
  const Info = mongoose.model('Info', InfoSchema);
  
  const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Info' },
  });
  const User = mongoose.model('User', userSchema);
  
  app.use(express.json());

  const KiemTraToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Khong co token, khong duoc vao' });
    jwt.verify(token, 'TaoLaHacker', (err, user) => {
      if (err) return res.status(403).json({ error: 'Token khong hop le' });
      req.user = user;
      next();
    });
  };
  
  app.post('/api/info', async (req, res) => {
    const {
      HovaTen,
      NgaySinh,
      NoiSinh,
      QuocTich,
      QuaTrinhHocVan,
      LamViec,
      ThongTinBoSung,
    } = req.body;
    try {
      const newInfo = await Info.create({
        HovaTen,
        NgaySinh,
        NoiSinh,
        QuocTich,
        QuaTrinhHocVan,
        LamViec,
        ThongTinBoSung,
      });
      res.status(201).json({ message: 'Them thong tin thanh cong', Info: newInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Loi server' });
    }
  });
  

  app.post('/api/users', async (req, res) => {
    const { username, password, Id } = req.body;
    try {
      const newUser = await User.create({ username, password, Id });
      res.status(201).json({ message: 'Tao user thanh cong', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Loi server' });
    }
  });



  app.post('/api/logout', (req, res) => {
    res.status(200).json({ message: 'Dang xuat thanh cong' });
  });

  app.listen(3000, () => {
    console.log('Server is running!');
});