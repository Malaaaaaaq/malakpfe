$agentsData = [
    ['first'=>'Karima','last'=>'Idrissi','email'=>'karima.idrissi@parlak.ma','phone'=>'0612345678','park'=>'Twin Center Parking','city_id'=>1,'lat'=>33.5867,'lng'=>-7.6430,'addr'=>'Bd Zerktouni, Maarif, Casablanca'],
    ['first'=>'Hassan','last'=>'Moukrim','email'=>'hassan.moukrim@parlak.ma','phone'=>'0623456789','park'=>'Parking Agdal Center','city_id'=>2,'lat'=>33.9857,'lng'=>-6.8509,'addr'=>'Av. Al Amir Fal Ould Omeir, Rabat'],
    ['first'=>'Sofia','last'=>'Alaoui','email'=>'sofia.alaoui@parlak.ma','phone'=>'0634567890','park'=>'Parking Gueliz Premium','city_id'=>3,'lat'=>31.6358,'lng'=>-8.0099,'addr'=>'Av. Mohammed V, Gueliz, Marrakech'],
    ['first'=>'Omar','last'=>'Tahiri','email'=>'omar.tahiri@parlak.ma','phone'=>'0645678901','park'=>'Parking Port Tanger Marina','city_id'=>4,'lat'=>35.7888,'lng'=>-5.8138,'addr'=>'Av. de la Resistance, Tanger'],
    ['first'=>'Nadia','last'=>'Berrada','email'=>'nadia.berrada@parlak.ma','phone'=>'0656789012','park'=>'Parking Medina Fes','city_id'=>5,'lat'=>34.0647,'lng'=>-4.9783,'addr'=>'Bab Bou Jeloud, Fes'],
];

// Supprimer non-pro
foreach(['test@gmail.com','hhhhhhh@gmail.com'] as $em) {
    $u = App\Models\User::where('email',$em)->first();
    if ($u) {
        foreach(App\Models\Parking::where('user_id',$u->id)->get() as $p) {
            foreach($p->zones as $z) { $z->spots()->delete(); }
            $p->zones()->delete();
            $p->delete();
        }
        $u->delete();
        echo "Supprime: $em\n";
    }
}

// Creer agents pro
foreach($agentsData as $a) {
    if (App\Models\User::where('email',$a['email'])->exists()) { echo "Existe: {$a['email']}\n"; continue; }
    $u = App\Models\User::create(['firstname'=>$a['first'],'lastname'=>$a['last'],'email'=>$a['email'],'phone'=>$a['phone'],'role'=>'agent','parking_name'=>$a['park'],'password'=>bcrypt('Parlak@2025')]);
    $p = App\Models\Parking::create(['user_id'=>$u->id,'city_id'=>$a['city_id'],'name'=>$a['park'],'address'=>$a['addr'],'latitude'=>$a['lat'],'longitude'=>$a['lng'],'total_spots'=>48,'rating'=>4.5,'is_active'=>true]);
    foreach(['A','B','C','D'] as $i=>$l) {
        $z = $p->zones()->create(['name'=>"Zone $l",'level'=>$i<2?1:2]);
        for($n=1;$n<=12;$n++) {
            $t = ($n<=9)?'standard':(($n==10)?'vip':(($n==11)?'electrique':'handicap'));
            $z->spots()->create(['code'=>"$l-".str_pad($n,2,'0',STR_PAD_LEFT),'type'=>$t,'price_per_hour'=>$t=='vip'?20:($t=='electrique'?15:10),'status'=>'libre']);
        }
    }
    echo "Agent cree: {$a['first']} {$a['last']} -> {$a['park']}\n";
}

echo "\n--- ETAT FINAL ---\n";
foreach(App\Models\User::where('role','agent')->get() as $ag) {
    echo $ag->firstname . ' ' . $ag->lastname . ' (' . $ag->email . ")\n";
    foreach(App\Models\Parking::where('user_id',$ag->id)->get() as $pk) {
        echo "  -> " . $pk->name . ' (' . $pk->spots()->count() . " places)\n";
    }
}
echo "DONE\n";
