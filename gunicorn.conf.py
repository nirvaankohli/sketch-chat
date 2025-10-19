import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "eventlet"
worker_connections = 1000
timeout = 30
keepalive = 2

daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

accesslog = "-"
errorlog = "-"
loglevel = "info"

proc_name = "sketch-chat"

bind = "0.0.0.0:8000"



def on_starting(server):
    """Called just before the master process is initialized."""
    pass


def on_reload(server):
    """Called before the master process is reloaded."""
    pass


def when_ready(server):
    """Called just after the server is started."""
    pass


def on_exit(server):
    """Called just before the master process exits."""
    pass
