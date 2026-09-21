<?php
/**
 * Instalación desatendida de LinkStack para Málaga Space Team.
 *
 * Hace lo mismo que el asistente web de instalación (crear el usuario admin,
 * ajustar .env y borrar el fichero INSTALLING) y añade los enlaces iniciales.
 * Lo ejecuta init.sh una sola vez, en el primer arranque del contenedor.
 * A partir de ahí los enlaces se gestionan desde el panel (/social/login).
 */

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

require '/htdocs/vendor/autoload.php';
$app = require '/htdocs/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$handle   = 'malagaspaceteam';
$email    = getenv('LINKSTACK_ADMIN_EMAIL') ?: 'spaceteam@uma.es';
$password = getenv('LINKSTACK_ADMIN_PASSWORD');

// Enlaces iniciales: [botón predefinido de LinkStack, tipo de bloque, título, URL]
$links = [
    ['linkedin',      'predefined', 'LinkedIn',         'https://www.linkedin.com/company/malaga-space-team'],
    ['instagram',     'predefined', 'Instagram',        'https://www.instagram.com/malagaspaceteam/'],
    ['default email', 'email',      'spaceteam@uma.es', 'mailto:spaceteam@uma.es'],
];

if (DB::table('users')->count() > 0) {
    echo "[seed] Ya existen usuarios, no se toca la base de datos.\n";
} else {
    $now = date('Y-m-d H:i:s');

    DB::table('users')->insert([
        'id'                     => 1,
        'name'                   => 'Málaga Space Team',
        'email'                  => $email,
        'email_verified_at'      => '0001-01-01 00:00:00',
        'password'               => Hash::make($password),
        'littlelink_name'        => $handle,
        'littlelink_description' => 'Equipo universitario de la Universidad de Málaga. Desarrollamos un CubeSat 2U.',
        'role'                   => 'admin',
        'block'                  => 'no',
        'created_at'             => $now,
        'updated_at'             => $now,
    ]);

    foreach ($links as $i => [$button, $type, $title, $url]) {
        $buttonId = DB::table('buttons')->where('name', $button)->value('id');
        if (!$buttonId) {
            fwrite(STDERR, "[seed] Botón '$button' no encontrado, se omite.\n");
            continue;
        }
        DB::table('links')->insert([
            'user_id'     => 1,
            'button_id'   => $buttonId,
            'link'        => $url,
            'title'       => $title,
            'type'        => $type,
            'type_params' => json_encode(['custom_html' => false]),
            'order'       => $i,
            'created_at'  => $now,
            'updated_at'  => $now,
        ]);
    }

    // Avatar del perfil (LinkStack lo busca como assets/img/<id>_*.png)
    if (file_exists(__DIR__ . '/avatar.png') && !glob('/htdocs/assets/img/1_*')) {
        copy(__DIR__ . '/avatar.png', '/htdocs/assets/img/1_' . time() . '.png');
    }

    echo "[seed] Usuario '@$handle' creado con " . count($links) . " enlaces.\n";
}

// Ajustes de .env equivalentes al último paso del instalador
$env = file_get_contents('/htdocs/.env');
$set = function (string $key, string $value) use (&$env) {
    $line = $key . '=' . $value;
    if (preg_match('/^' . preg_quote($key, '/') . '=.*$/m', $env)) {
        $env = preg_replace('/^' . preg_quote($key, '/') . '=.*$/m', $line, $env);
    } else {
        $env = rtrim($env) . "\n" . $line . "\n";
    }
};
$set('APP_NAME', '"Málaga Space Team"');
$set('ADMIN_EMAIL', $email);
$set('HOME_URL', '"' . $handle . '"');   // /social muestra directamente el perfil
$set('ALLOW_REGISTRATION', 'false');
$set('REGISTER_AUTH', 'auth');
$set('LOCALE', 'es');
$set('APP_DEBUG', 'false');
$set('APP_ENV', 'production');
if (getenv('LINKSTACK_FORCE_HTTPS') === 'true') {
    $set('FORCE_HTTPS', 'true');
}
file_put_contents('/htdocs/.env', $env);

foreach (['/htdocs/INSTALLING', '/htdocs/INSTALLERLOCK'] as $file) {
    if (file_exists($file)) {
        unlink($file);
    }
}

echo "[seed] Instalación completada.\n";
